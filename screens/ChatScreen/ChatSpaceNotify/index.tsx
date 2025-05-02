import React from 'react';
import {NavigationProps} from '../../../types/navigationType.tsx';
import {Divider, Layout} from '@ui-kitten/components';
import {SocialEvent} from '../../../services/socket/events.ts';
import {useGlobal} from '../../../hooks/GlobalContext.tsx';
import {useSocket} from '../../../services/socket/hooks/SocketContext.tsx';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import CardList from '../../../component/List/CardList.tsx';

const ChatSpaceNotify: React.FC<NavigationProps> = ({ navigation }) => {
    const [notifyData, setNotifyData] = React.useState<any[]>([]);

    const { userId } = useGlobal();
    const { handleFriendAdd, handleFriendAddOffline, subscribe, unsubscribe } = useSocket();

    const onEndReached = async () => {
        setNotifyData((prev: any[]) => [...prev, ...[]]);
    };

    const onRefresh = async () => {
        setNotifyData([]);
    };

    const handleFriendAddResponse = (to: string, status: string) => {
        handleFriendAdd(userId, to, status, (ack: any) => {
            if (ack.status === 'success') {
                console.log('发送加友请求处理成功', ack.data);
            } else {
                console.log('发送加友请求处理失败', ack.message, ack.code);
            }
        });
    };

    React.useEffect(() => {
        handleFriendAddOffline(userId, (ack: any) => {
            const { status } = ack;
            if (status === 'success') {
                console.log('获取离线加友请求成功', ack.data);
            } else {
                console.log('获取离线加友请求失败', ack.message, ack.code);
            }
        });

        const handler = (payload: any, ack: any) => {
            console.log('收到加友请求', payload);
            setNotifyData((prev: any[]) => [payload, ...prev]);
            ack({ status: 'success'});
        };

        // 动态订阅特定事件
        subscribe(SocialEvent.FriendAdd, handler);
        return () => unsubscribe(SocialEvent.FriendAdd, handler);
    }, []);

    return (
        <Layout style={{ flex: 1 }}>
            <TopNavigationOpe
                title={'通知'}
                navigation={navigation}
                renderItemAccessory={() => <></>}
            />
            <Divider />
            <Layout style={{ flex: 1 }}>
                <CardList
                    data={notifyData}
                    renderEmptyLabel={'还没有通知哦, 去烦别人吧'}
                    onEndReached={onEndReached}
                    onRefresh={onRefresh}
                    handleFriendAddResponse={handleFriendAddResponse}
                />
            </Layout>
        </Layout>
    );
};

export default ChatSpaceNotify;
