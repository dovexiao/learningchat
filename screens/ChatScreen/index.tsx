import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {NavigationProps} from '../../types/navigationType.tsx';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import {Divider, Layout, Text, TopNavigationAction} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import { BasicList } from '../../component/List/BasicList.tsx';
import * as CommonIcon from '../../component/Icon';

const data = new Array(15).fill({
    title: '用户123',
    subTitle: 'Description for Item 1234556787577522222211314141',
    other: 1000,
});

const ChatMain: React.FC<NavigationProps> = ({ navigation }) => {
    const onMessageClick = (item: any) => {
        navigation.navigate('ChatSpace', { item });
    };

    const accessoryLeft = (): IconElement => (
        <TopNavigationAction
            icon={CommonIcon.PersonIcon}
        />
    );

    const accessoryRight = (item: any) => (
        <>
            {item.other > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>
                        {item.other > 99 ? '99+' : item.other}
                    </Text>
                </View>
            )}
        </>
    );

    const renderOpeAccessory = () => (
        <></>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationAvatar
                navigation={navigation}
                renderItemAccessory={renderOpeAccessory}
            />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <BasicList
                    data={data}
                    accessoryLeft={accessoryLeft}
                    accessoryRight={accessoryRight}
                    onListItemClick={onMessageClick}
                />
            </Layout>
        </SafeAreaView>
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
