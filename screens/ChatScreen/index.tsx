import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {NavigationProps} from '../../types/navigationType.ts';
import {Layout, Text, TopNavigationAction} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import BasicList from '../../component/List/BasicList.tsx';
import * as CommonIcon from '../../component/Icon';
import {useSocket} from '../../hooks/SocketContext.tsx';
import {ChatEvent} from '../../services/socket/events.ts';
import {useGlobal} from '../../hooks/GlobalContext.tsx';
import { useCache } from "../../hooks/CacheContext.tsx";

const ChatMain: React.FC<NavigationProps> = ({ navigation }) => {
    const { chatSpaces } = useCache();

    const onSpaceClick = (item: any) => {
        navigation.navigate('ChatSpace', { item });
    };

    return (
        <Layout style={{ flex: 1 }}>
            {
                chatSpaces.map((item: any, index: number) => (
                    <Pressable key={index} onPress={() => onSpaceClick(item)}>
                        <Text>
                            {item.spaceId}-{item.type}-{item.avatar}-{item.name}-{item.latestMessage}-{item.unread}
                        </Text>
                    </Pressable>
                ))
            }
            {/*<BasicList*/}
            {/*    data={spaceData}*/}
            {/*    renderEmptyLabel={'还没有好友/群哦, 去加一个吧'}*/}
            {/*    accessoryLeft={accessoryLeft}*/}
            {/*    accessoryRight={accessoryRight}*/}
            {/*    onEndReached={onEndReached}*/}
            {/*    onRefresh={onRefresh}*/}
            {/*    onListItemClick={onSpaceClick}*/}
            {/*/>*/}
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


// const accessoryLeft = (): IconElement => (
//     <TopNavigationAction
//         icon={CommonIcon.PersonIcon}
//     />
// );
//
// const accessoryRight = (item: any) => (
//     <>
//         {item.unread > 0 && (
//             <View style={styles.unreadBadge}>
//                 <Text style={styles.unreadText}>
//                     {item.unread > 99 ? '99+' : item.unread}
//                 </Text>
//             </View>
//         )}
//     </>
// );
//
// const onEndReached = async () => {
//     setSpaceData((prev: any[]) => [...prev, ...[]]);
// };
//
// const onRefresh = async () => {
//     setSpaceData([]);
// };
