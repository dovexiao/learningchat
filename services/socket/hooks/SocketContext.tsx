// src/services/socket/hooks/SocketContext.tsx
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import SocketService from '../index';
import {SocialEvent, ChatEvent} from '../events.ts';

type SocketContextType = {
    connect: (token: string) => void;
    disconnect: () => void;
    isConnected: boolean | undefined;
    handleFriendAdd: (sentUserId: string, targetUserId: string, status: string, ack: (clientAck: any) => void, message?: string) => void;
    handleFriendAddOffline: (receiverId: string, ack: (clientAck: any) => void) => void;
    handleChatPrivateOffline: (receiverId: string, ack: (clientAck: any) => void) => void;
    subscribe: <T>(event: string, handler: (payload: T, ack: T) => void) => void;
    unsubscribe: (event: string, handler: (...args: any[]) => void) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined);

    // 处理加友
    const handleFriendAdd = (sentUserId: string, targetUserId: string, status: string, ack: (clientAck: any) => void, message?: string) => {
        // console.log('from', sentUserId, 'to', targetUserId, 'status', status);
        const socket = SocketService.getSocket();
        socket?.emit(SocialEvent.FriendAdd, {
            from: sentUserId,
            to: targetUserId,
            message,
            status: status,
        }, ack);
    };

    // 处理加友离线
    const handleFriendAddOffline = (receiverId: string, ack: (clientAck: any) => void) => {
        const socket = SocketService.getSocket();
        socket?.emit(SocialEvent.FriendAddOffline, {
            to: receiverId,
        }, ack);
    };

    const handleChatPrivateOffline = (receiverId: string, ack: (clientAck: any) => void) => {
        const socket = SocketService.getSocket();
        socket?.emit(ChatEvent.ChatPrivateOffline, {
            to: receiverId,
        }, ack);
    };

    // 新增订阅监听器
    const subscribe = useCallback(<T,>(event: string, handler: (payload: T, ack: T) => void) => {
        SocketService.on(event, handler);
    }, []);

    const unsubscribe = useCallback((event: string, handler: (...args: any[]) => void) => {
        SocketService.off(event, handler);
    }, []);

    // 连接与状态监听
    const connect = (token: string) => {
        SocketService.connect(token);
        // 注册状态监听
        SocketService.on('connect', () => setIsConnected(true));
        SocketService.on('disconnect', () => setIsConnected(false));
    };

    // 断开连接
    const disconnect = () => {
        SocketService.disconnect();
    };

    // 清理监听
    useEffect(() => {
        return () => {
            SocketService.cleanup();
        };
    }, []);

    const socketContextValue: SocketContextType = {
        connect,
        disconnect,
        isConnected,
        handleFriendAdd,
        handleFriendAddOffline,
        handleChatPrivateOffline,
        subscribe,
        unsubscribe,
    };

    return (
        <SocketContext.Provider value={socketContextValue}>
            {children}
        </SocketContext.Provider>
    );
};

// 自定义Hook
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useGlobal must be used within an GlobalProvider');
    }
    return context;
};
