import {
    TopNavigationAction,
    Input,
    Divider,
    Layout,
    List,
    Text,
    useTheme,
} from '@ui-kitten/components';
import React from 'react';
import {NavigationProps} from '../../../types/navigationType.tsx';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import * as CommonIcon from '../../../component/Icon';

interface IListItem {
    userName: string;
    content: string;
}

const data = [
    {
        userName: '用户123',
        content: 'Description for Item 1234556787577 fshfh5 fjs9iadiaafh sfjhjfhsfifdsif',
    },
    {
        userName: '用户123',
        content: 'Description for Item 1234556787577 fshfh5 fjs9iadiaafh sfjhjfhsfifdsif',
    },
    {
        userName: '用户123',
        content: 'Description for Item 1234556787577 fshfh5 fjs9iadiaafh sfjhjfhsfifdsif',
    },
];

const ChatSpace: React.FC<NavigationProps> = ({ navigation, route }) => {
    const MessageItem = route.params.item;
    const [chatContent, setChatContent] = React.useState('');
    const themes = useTheme();

    const renderRightActions = (): React.ReactElement => (
        <>
            <TopNavigationAction
                icon={CommonIcon.SettingsIcon}
                onPress={() => {Alert.alert('设置');}}
            />
        </>
    );

    const renderItem = ({ item, index }: { item: IListItem; index: number }): React.ReactElement => (
        <View style={styles.recordItem}>
            {index % 2 === 0 && (
                <View style={styles.avatarContainer}>
                    <TopNavigationAction
                        icon={CommonIcon.PersonIcon}
                    />
                </View>
            )}
            <View style={[
                styles.contentContainer,
                index % 2 === 0 ? styles.leftAlign : styles.rightAlign,
            ]}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.userName + `${index}`}
                </Text>
                <Text style={[styles.content, {backgroundColor: themes['background-basic-color-1']}]}>
                    {item.content}
                </Text>
            </View>
            {index % 2 === 1 && (
                <View style={styles.avatarContainer}>
                    <TopNavigationAction
                        icon={CommonIcon.PersonIcon}
                    />
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe navigation={navigation} renderItemAccessory={renderRightActions} title={MessageItem.title} />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <List
                    style={styles.container}
                    data={data}
                    // ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
                />
            </Layout>
            <View style={[styles.opeContainer, { backgroundColor: themes['background-basic-color-1']}]}>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="enter"
                        value={chatContent}
                        onChangeText={nextValue => setChatContent(nextValue)}
                    />
                </View>
                <View style={styles.sendContainer}>
                    {/*<Button*/}
                    {/*    size="small"*/}
                    {/*    onPress={() => {Alert.alert('发送');}}*/}
                    {/*>*/}
                    {/*    发送*/}
                    {/*</Button>*/}
                    <TopNavigationAction
                        icon={CommonIcon.SendIcon}
                        onPress={() => {Alert.alert('发送');}}
                    />
                </View>
                <View style={styles.opesContainer}>
                    <TopNavigationAction
                        icon={CommonIcon.MoreOpeIcon}
                        onPress={() => {Alert.alert('更多');}}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    recordItem: {
        flexDirection: 'row',
        marginVertical: 20,
        // paddingHorizontal: 10,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        display: 'flex',
        marginHorizontal: 5,
        // backgroundColor: '#e30e0e',
    },
    contentContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        lineHeight: 25,
    },
    leftAlign: {
        alignItems: 'flex-start',
    },
    rightAlign: {
        alignItems: 'flex-end',
    },
    opeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    inputContainer: {
        flex: 1,
    },
    sendContainer: {
        marginLeft: 10,
    },
    opesContainer: {
        marginRight: 0,
    },
});

export default ChatSpace;
