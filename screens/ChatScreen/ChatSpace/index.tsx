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
import {NavigationProps} from '../../../types/navigationType.ts';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import * as CommonIcon from '../../../component/Icon';
import {useCache} from "../../../hooks/CacheContext.tsx";

// interface IListItem {
//     userName: string;
//     content: string;
// }

const ChatSpace: React.FC<NavigationProps> = ({ navigation, route }) => {
    const chatSpace = route.params.item;
    const [chatContent, setChatContent] = React.useState('');
    const themes = useTheme();
    const { chatMessages, sendChatMessage } = useCache()

    const renderRightActions = (): React.ReactElement => (
        <>
            <TopNavigationAction
                icon={CommonIcon.SettingsIcon}
                onPress={() => {Alert.alert('设置');}}
            />
        </>
    );

    // const renderItem = ({ item, index }: { item: any; index: number }): React.ReactElement => (
    //     <View style={styles.recordItem}>
    //         {index % 2 === 0 && (
    //             <View style={styles.avatarContainer}>
    //                 <TopNavigationAction
    //                     icon={CommonIcon.PersonIcon}
    //                 />
    //             </View>
    //         )}
    //         <View style={[
    //             styles.contentContainer,
    //             index % 2 === 0 ? styles.leftAlign : styles.rightAlign,
    //         ]}>
    //             <Text style={styles.userName} numberOfLines={1} ellipsizeMode={'tail'}>
    //                 {item.userName + `${index}`}
    //             </Text>
    //             <Text style={[styles.content, {backgroundColor: themes['background-basic-color-1']}]}>
    //                 {item.content}
    //             </Text>
    //         </View>
    //         {index % 2 === 1 && (
    //             <View style={styles.avatarContainer}>
    //                 <TopNavigationAction
    //                     icon={CommonIcon.PersonIcon}
    //                 />
    //             </View>
    //         )}
    //     </View>
    // );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe navigation={navigation} renderItemAccessory={renderRightActions} title={chatSpace.name} />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center' }}>
                {/*<List*/}
                {/*    style={styles.container}*/}
                {/*    data={}*/}
                {/*    // ItemSeparatorComponent={Divider}*/}
                {/*    renderItem={renderItem}*/}
                {/*/>*/}
                {
                    chatMessages.filter((item: any) => item.spaceId === chatSpace.spaceId).map((item: any) => (
                        <View key={item.mid}>
                            <Text>{item.from.nickname}-{item.from.avatar}-{item.content.type}-{item.content.body}</Text>
                        </View>
                    ))
                }
            </Layout>
            <View style={[styles.opeContainer, { backgroundColor: themes['background-basic-color-1']}]}>
                <View style={styles.inputContainer}>
                    <Input
                        style={styles.input}
                        placeholder="听我说..."
                        value={chatContent}
                        onChangeText={nextValue => setChatContent(nextValue)}
                    />
                </View>
                <View style={styles.sendContainer}>
                    <TopNavigationAction
                        icon={CommonIcon.SendIcon}
                        onPress={async () => {
                            if (chatContent) {
                                await sendChatMessage(chatSpace.spaceId, chatContent)
                            } else {
                                Alert.alert('输入内容不能为空');
                            }
                        }}
                    />
                </View>
                <View style={styles.opesContainer}>
                    <TopNavigationAction
                        icon={CommonIcon.MoreSelectIcon}
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
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        borderWidth: 0
    },
    sendContainer: {
        marginLeft: 10,
    },
    opesContainer: {
        marginRight: 0,
    },
});

export default ChatSpace;
