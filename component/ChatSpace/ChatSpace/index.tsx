import {Icon, IconElement, TopNavigationAction, Input, Divider, Layout, List, Text, Button} from '@ui-kitten/components';
import React from 'react';
import {NavigationProps} from '../../../types/navigationType.tsx';
import TopNavigationOpe from '../../TopNavigation/TopNavigationOpe.tsx';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';

const SettingsIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="settings-outline"
    />
);

const MoreIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="grid-outline"
    />
);

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
    const userIndex = route.params.index;
    const [chatContent, setChatContent] = React.useState('');

    const renderRightActions = (): React.ReactElement => (
        <>
            <TopNavigationAction icon={SettingsIcon} onPress={() => {Alert.alert('设置');}} />
        </>
    );

    const renderItem = ({ item, index }: { item: IListItem; index: number }): React.ReactElement => (
        <View style={styles.recordItem}>
            {index % 2 === 0 && (
                <View style={styles.avatarContainer}>
                    <Icon name="person" />
                </View>
            )}
            <View style={[
                styles.contentContainer,
                index % 2 === 0 ? styles.leftAlign : styles.rightAlign,
            ]}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode={'tail'}>
                    {item.userName + `${index}`}
                </Text>
                <Text style={styles.content}>
                    {item.content}
                </Text>
            </View>
            {index % 2 === 1 && (
                <View style={styles.avatarContainer}>
                    <Icon name="person" />
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe navigation={navigation} renderItemAccessory={renderRightActions} title={userIndex} />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <List
                    style={styles.container}
                    data={data}
                    // ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
                />
            </Layout>
            <View style={styles.opeContainer}>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="enter"
                        value={chatContent}
                        onChangeText={nextValue => setChatContent(nextValue)}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        size="small"
                        onPress={() => {Alert.alert('发送');}}
                    >
                        发送
                    </Button>
                </View>
                <View style={styles.opesContainer}>
                    <Button
                        size="small"
                        onPress={() => {Alert.alert('更多');}}
                        accessoryRight={MoreIcon}
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
        width: '66%',
    },
    buttonContainer: {
        width: '15%',
        marginHorizontal: '2%',
    },
    opesContainer: {
        width: '15%',
        marginRight: '2%',
    },
});

export default ChatSpace;
