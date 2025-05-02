import React from 'react';
import { StyleSheet, View } from 'react-native';
import {NavigationProps} from '../../types/navigationType.tsx';
import {Layout, Text, TopNavigationAction} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import BasicList from '../../component/List/BasicList.tsx';
import * as CommonIcon from '../../component/Icon';
import {useSocket} from '../../services/socket/hooks/SocketContext.tsx';
import {ChatEvent} from '../../services/socket/events.ts';
import {useGlobal} from '../../hooks/GlobalContext.tsx';

const ChatMain: React.FC<NavigationProps> = ({ navigation }) => {
    const [spaceData, setSpaceData] = React.useState<any[]>([]);

    const { userId } = useGlobal();
    const { handleChatPrivateOffline, subscribe, unsubscribe } = useSocket();

    const onSpaceClick = (item: any) => {
        navigation.navigate('ChatSpace', { item });
    };

    const accessoryLeft = (): IconElement => (
        <TopNavigationAction
            icon={CommonIcon.PersonIcon}
        />
    );

    const accessoryRight = (item: any) => (
        <>
            {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>
                        {item.unread > 99 ? '99+' : item.unread}
                    </Text>
                </View>
            )}
        </>
    );

    const onEndReached = async () => {
        setSpaceData((prev: any[]) => [...prev, ...[]]);
    };

    const onRefresh = async () => {
        setSpaceData([]);
    };

    React.useEffect(() => {
        handleChatPrivateOffline(userId, (ack: any) => {
            const { status } = ack;
            if (status === 'success') {
                console.log('获取离线单聊消息成功', ack.data);
            } else {
                console.log('获取离线单聊消息失败', ack.message, ack.code);
            }
        });

        const handler = (payload: any, ack: any) => {
            console.log('收到单聊消息', payload);
            if (payload.userInfo) {
                const newSpace: any = {
                    spaceId: payload.userInfo.type === 'sender' ? payload.from : payload.to,
                    spaceName: payload.userInfo.name,
                    spaceAvatar: payload.avatar,
                    latestMessage: payload.content.type === 'text' ? payload.content.body : '',
                    unread: 1,
                };
                newSpace.title = newSpace.spaceName;
                newSpace.subTitle = newSpace.latestMessage;
                console.log(newSpace);
                setSpaceData((prev: any[]) => [newSpace, ...prev]);
            }
            ack({ status: 'success'});
        };

        // 动态订阅特定事件
        subscribe(ChatEvent.ChatPrivate, handler);
        return () => {
            unsubscribe(ChatEvent.ChatPrivate, handler);
        };
    }, []);

    return (
        <Layout style={{ flex: 1 }}>
            <BasicList
                data={spaceData}
                renderEmptyLabel={'还没有好友/群哦, 去加一个吧'}
                accessoryLeft={accessoryLeft}
                accessoryRight={accessoryRight}
                onEndReached={onEndReached}
                onRefresh={onRefresh}
                onListItemClick={onSpaceClick}
            />
        </Layout>
    );
};

const styles = StyleSheet.create({
    unreadBadge: {
        backgroundColor: 'red',
        borderRadius: 13,
        height: 26,
        minWidth: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ChatMain;
