import { Divider, Icon, Layout, List, Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp  } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationProps, RootStackParamList } from '../../types/navigationType.tsx';

type ChatSpaceNavigationProp = StackNavigationProp<RootStackParamList, 'ChatSpace'>;

interface IListItem {
    chatSpaceName: string;
    lastMessage: string;
    unreadCount: number;
}

const data = new Array(15).fill({
    chatSpaceName: '用户123',
    lastMessage: 'Description for Item 1234556787577522222211314141',
    unreadCount: 1000,
});

const MessageList: React.FC<NavigationProps> = () => {
    const navigation = useNavigation<ChatSpaceNavigationProp>();
    const themes = useTheme();
    const onMessageClick = (index: number) => {
        navigation.navigate('ChatSpace', { index });
    };

    const renderItem = ({ item, index }: { item: IListItem; index: number }): React.ReactElement => (
        <TouchableOpacity
            style={[styles.messageItem, { backgroundColor: themes['background-basic-color-1']}]}
            onPress={() => onMessageClick(index)}
        >
            <View style={styles.avatarContainer}>
                <Icon
                    name="person"
                />
            </View>
            <View style={styles.messageContent}>
                <Text style={styles.chatSpaceName} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.chatSpaceName}
                </Text>
                <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.lastMessage}
                </Text>
            </View>
            {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>
                        {item.unreadCount > 99 ? '99+' : item.unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <List
                    style={styles.container}
                    data={data}
                    ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
                />
            </Layout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    messageItem: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        // borderRadius: 20,
        // backgroundColor: '#ccc',
        // justifyContent: 'center',
        // alignItems: 'center',
        marginHorizontal: 10,
    },
    messageContent: {
        flex: 1,
    },
    chatSpaceName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    unreadBadge: {
        backgroundColor: 'red',
        borderRadius: 12,
        height: 24,
        minWidth: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 25,
        marginRight: 15,
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default MessageList;
