import React, {useState} from 'react';
import * as chatTypes from "../types/chatTypes.ts";
import * as systemTypes from "../types/systemTypes.ts";
import {ChatEvent, SocialEvent, SystemEvent} from "../services/socket/events.ts";
import { useSocket } from "./SocketContext.tsx";
import { useGlobal } from "./GlobalContext.tsx";
import { saveImageToFile } from "../services/storage/ImageCache.ts";
import RNUUID from 'react-native-uuid';
import * as ChatApi from "../services/api/ChatApi.ts";
import * as SystemApi from "../services/api/SystemApi.ts";

type CacheContextType = {
    chatSpaces: chatTypes.ChatSpaceType[],
    chatMessages: chatTypes.ChatMessagesType[],
    systemNotifications: systemTypes.systemNotificationType[],
    chatSpacesSearchResult: chatTypes.ChatSpaceSearchType,
    searchChatSpacesByName: (name: string) => Promise<void>,
    clearChatSpacesSearchResult: () => void;
    sendAddFriendRequest: (targetUserId: string) => void;
    handleFriendAddNotification: (mid: string, targetUserId: string, status: string, leaveMessage?: string) => void;
    sendChatMessage: (spaceId: string, content: string) => Promise<void>;
};

const EMPTY_CHAT_SPACES_SEARCH: chatTypes.ChatSpaceSearchType = { users: [], groups: [] };

export const CacheContext = React.createContext<CacheContextType | null>(null);

export const CacheProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [systemNotifications, setSystemNotifications] = React.useState<systemTypes.systemNotificationType[]>([]);
    const [chatSpaces, setChatSpaces] = React.useState<chatTypes.ChatSpaceType[]>([]);
    const [chatSpacesSearchResult, setChatSpacesSearchResult] = useState<chatTypes.ChatSpaceSearchType>(EMPTY_CHAT_SPACES_SEARCH);
    const [chatMessages, setChatMessages] = React.useState<chatTypes.ChatMessagesType[]>([]);

    const { userId } = useGlobal();
    const { subscribe, unsubscribe, isConnected } = useSocket();

    // 搜索聊天空间by名称
    const searchChatSpacesByName = async (name: string) => {
        try {
            const newSearchResult = await ChatApi.getSpacesByName(userId, name);
            setChatSpacesSearchResult(newSearchResult);
        } catch (error) {
            console.error(error);
        }
    }

    // 清除聊天空间搜索结果
    const clearChatSpacesSearchResult = () => {
        setChatSpacesSearchResult(EMPTY_CHAT_SPACES_SEARCH);
    }

    // 发送文本消息
    const sendChatMessage = async (spaceId: string, content: string) => {
        try {
            await ChatApi.sendChatMessage(userId, spaceId, content);
        } catch (error) {
            console.error(error);
        }
    }

    // 发送加友请求
    const sendAddFriendRequest = async (targetUserId: string, leaveMessage?: string) => {
        try {
            const { serverPayload: payload } = await SystemApi.sendFriendAdd(null, userId, targetUserId,'pending', leaveMessage);
            setSystemNotifications((prev: any) => [...prev, payload])
        } catch (error) {
            console.error(error);
        }
    }

    // 发送加友通知处理
    const handleFriendAddNotification = async (mid: string, targetUserId: string, status: string, leaveMessage?: string) => {
        try {
            const { serverPayload: payload } = await SystemApi.sendFriendAdd(mid, userId, targetUserId, status, leaveMessage);
            setSystemNotifications(systemNotifications.map((notification: any) => notification.mid === payload.mid ? payload : notification));

            // 特殊处理加友同意的通知发送
            if (payload.body.type === 'friendAdd' && payload.body.status === 'accepted') {
                const avatarUrl = await saveImageToFile(payload.to.avatar, 'AVATARS')
                setChatSpaces(prev => [...prev, {
                    spaceId: payload.other.room,
                    type: 'friend' as const,
                    name: payload.to.nickname,
                    avatar: avatarUrl,
                    introduction: payload.to.introduction,
                    latestMessage: '我已同意接受你为好友',
                    unread: 1,
                    timestamp: payload.timestamp
                }].sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
                initializeFriendMessage(payload);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 系统通知处理器
    const systemNotificationHandler = async (payload: any, ack: any) => {
        try {
            setSystemNotifications(prev =>
                prev.some(n => n.mid === payload.mid)
                    ? prev.map(n => n.mid === payload.mid ? payload : n)
                    : [...prev, payload]
            )

            // 特殊处理加友同意的通知
            if (payload.body.type === 'friendAdd' && payload.body.status === 'accepted') {
                const avatarUrl = await saveImageToFile(payload.from.avatar, 'AVATARS')
                setChatSpaces(prev => [...prev, {
                    spaceId: payload.other.room,
                    type: 'friend' as const,
                    name: payload.from.nickname,
                    avatar: avatarUrl,
                    introduction: payload.from.introduction,
                    latestMessage: '我已同意接受你为好友',
                    unread: 1,
                    timestamp: payload.timestamp
                }].sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
                initializeFriendMessage(payload);
            }
            ack({ status: 'success' });
        } catch (error) {
            ack({ status: 'error' });
            console.error(error);
        }
    }

    // 聊天消息处理器
    const chatMessageHandler = async (payload: any, ack: any) => {
        try {
            setChatSpaces(prev =>
                prev.map(n => n.spaceId === payload.to ? {
                    ...n,
                    unread: n.unread + 1,
                    latestMessage: payload.content.body,
                    timestamp: payload.timestamp,
                } : n).sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )
            );
            setChatMessages((prev) => [...prev, {
                mid: payload.mid,
                spaceId: payload.to,
                from: payload.from,
                content: payload.content,
                timestamp: payload.timestamp,
            }]);
            ack({ status: 'success' });
        } catch (error) {
            ack({ status: 'error' });
            console.error(error);
        }
    }

    // 初始化联系人消息
    const initializeFriendMessage = (payload: any) => {
        setChatMessages((prev) => [...prev, {
            mid: RNUUID.v4(),
            spaceId: payload.other.room,
            from: payload.from,
            content: {
                type: 'text' as const,
                body: '我已同意接受你为好友',
            },
            timestamp: payload.timestamp,
        }]);
    }

    React.useEffect(() => {
        // 在缓存层统一挂载事件监听和处理器
        if (isConnected) {
            subscribe(SystemEvent.SystemNotification, systemNotificationHandler);
            subscribe(ChatEvent.ChatPrivate, chatMessageHandler);
            // http获取离线通知
            // 获取离线单聊消息
            // 获取离线加友请求
        }

        return () => {
            // 卸载事件监听
            unsubscribe(SystemEvent.SystemNotification, systemNotificationHandler);
            unsubscribe(ChatEvent.ChatPrivate, chatMessageHandler);
        }
    }, [isConnected]);

    const cacheValue: CacheContextType = {
        chatSpaces,
        chatMessages,
        systemNotifications,
        chatSpacesSearchResult,
        searchChatSpacesByName,
        clearChatSpacesSearchResult,
        sendAddFriendRequest,
        handleFriendAddNotification,
        sendChatMessage,
    };

    return (
        <CacheContext.Provider value={cacheValue}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => {
    const context = React.useContext(CacheContext);
    if (!context) {
        throw new Error('useCache must be used within an GlobalProvider');
    }
    return context;
};
