import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {NavigationProps} from '../../types/navigationType.tsx';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import {Divider, Icon, Layout, Text, useTheme} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import { AccessList } from '../../component/List';

const data = new Array(15).fill({
    title: '用户123',
    subTitle: 'Description for Item 1234556787577522222211314141',
    other: 1000,
});

const ChatMain: React.FC<NavigationProps> = ({ navigation }) => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationAvatar
                navigation={navigation}
                // renderItemAccessory={renderItemAccessory}
            />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <MessageList navigation={navigation}/>
            </Layout>
        </SafeAreaView>
    );
};

const MessageList: React.FC<NavigationProps> = ({ navigation }) => {

    const onMessageClick = (item: any) => {
        navigation.navigate('ChatSpace', { item });
    };
    const themes = useTheme();

    const accessoryLeft = (): IconElement => (
        <Icon
            name="person"
            fill={themes['color-primary-500']}
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

    return (
        <AccessList
            data={data}
            accessoryLeft={accessoryLeft}
            accessoryRight={accessoryRight}
            onListItemClick={onMessageClick}
        />
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
