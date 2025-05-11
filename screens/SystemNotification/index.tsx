import React from 'react';
import {NavigationProps} from '../../types/navigationType.ts';
import {Divider, Layout, Text} from '@ui-kitten/components';
import TopNavigationOpe from '../../component/TopNavigation/TopNavigationOpe.tsx';
import {useCache} from "../../hooks/CacheContext.tsx";
import {Pressable, View} from "react-native";
import {useGlobal} from "../../hooks/GlobalContext.tsx";

const SystemNotification: React.FC<NavigationProps> = ({ navigation }) => {
    const { systemNotifications, handleFriendAddNotification } = useCache();
    const { userId } = useGlobal();

    return (
        <Layout style={{ flex: 1 }}>
            <TopNavigationOpe
                title={'通知'}
                navigation={navigation}
                renderItemAccessory={() => <></>}
            />
            <Divider />
            <Layout style={{ flex: 1 }}>
                {
                    systemNotifications.map((item: any, index: number) => (
                        <View key={index}>
                            <Text>{item.mid}-{item.from.nickname}-{item.to.nickname}-{item.body.type}-{item.body.status}-{item.body.leaveMessage}-{item.timestamp}</Text>
                            {userId !== item.from.userId && item.body.type === 'friendAdd' && item.body.status === 'pending' &&
                                <>
                                    <Pressable onPress={() => handleFriendAddNotification(item.mid, item.from.userId, 'accepted')}>
                                        <Text>同意</Text>
                                    </Pressable>
                                    <Pressable onPress={() => handleFriendAddNotification(item.mid, item.from.userId, 'rejected')}>
                                        <Text>拒绝</Text>
                                    </Pressable>
                                </>
                            }
                        </View>
                    ))
                }
            </Layout>
        </Layout>
    );
};

export default SystemNotification;
