import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp  } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../../types/navigationType.tsx';
import TopNavigationAvatar from "../TopNavigation/TopNavigationAvatar.tsx";
import { Divider, Icon, Layout, Text } from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import { AccessList } from "../List";

type ChatNavigationProp = StackNavigationProp<RootStackParamList, 'ChatComponent'>;

const data = new Array(15).fill({
    title: '用户123',
    subTitle: 'Description for Item 1234556787577522222211314141',
    other: 1000,
});

const MessageList: React.FC = () => {
    const navigation = useNavigation<ChatNavigationProp>();
    const onMessageClick = (index: number) => {
        navigation.navigate('ChatSpace', { index });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationAvatar
                navigation={navigation}
                // renderItemAccessory={renderItemAccessory}
            />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <AccessList
                    data={data}
                    accessoryLeft={accessoryLeft}
                    accessoryRight={accessoryRight}
                    onListItemClick={onMessageClick}
                />
            </Layout>
        </SafeAreaView>
    );
};

const accessoryLeft = (): IconElement => (
    <Icon
        name="person"
    />
)

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
)

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

export default MessageList;
