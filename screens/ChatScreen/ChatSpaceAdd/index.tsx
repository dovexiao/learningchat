import React from 'react';
import {NavigationProps} from '../../../types/navigationType.ts';
import {Pressable, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import {Icon, Input, Text, useTheme} from '@ui-kitten/components';
import {useCache} from "../../../hooks/CacheContext.tsx";

type searchResultProps = {
    chatSpaces: any[];
    users: any[];
};

const ChatSpaceAdd: React.FC<NavigationProps> = ({ navigation }) => {
    const [value, setValue] = React.useState('');
    const inputRef = React.useRef<any>(null);

    const {
        chatSpacesSearchResult,
        searchChatSpacesByName,
        clearChatSpacesSearchResult,
        sendAddFriendRequest,
    } = useCache()
    const themes = useTheme();

    const renderIcon = (props: any): React.ReactElement => (
        <TouchableWithoutFeedback>
            <Icon
                {...props}
                name="search-outline"
                width={15}
                height={15}
            />
        </TouchableWithoutFeedback>
    );

    React.useEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);

        return () => {
            clearChatSpacesSearchResult();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: themes['background-basic-color-1'] }}>
            <TopNavigationOpe
                title={'找人/找群'}
                navigation={navigation}
                renderItemAccessory={() => <></>}
            />
            <View style={styles.inputContainer}>
                <Input
                    style={{ borderColor: themes['color-primary-500'], backgroundColor: themes['background-basic-color-1'] }}
                    ref={inputRef}
                    placeholder="账号/昵称/群名称"
                    value={value}
                    accessoryLeft={renderIcon}
                    onChangeText={async nextValue => {
                        if (nextValue.length > 0) {
                            setValue(nextValue);
                            await searchChatSpacesByName(nextValue);
                        } else {
                            clearChatSpacesSearchResult();
                        }
                    }}
                />
            </View>
            {
                // chatSpacesSearchResult.groups.length === 0 &&
                chatSpacesSearchResult.users.length === 0 &&
                <View style={styles.emptyContainer}>
                    <Text>暂无搜索结果</Text>
                </View>
            }
            <View>
                {
                    chatSpacesSearchResult.users.map((item: any, index: number) => (
                        <View key={index}>
                            <Text>{item.username}-{item.nickname}-{item.introduction}-{item.avatar}</Text>
                            <TouchableOpacity onPress={() => sendAddFriendRequest(item.userId)}>
                                <View>
                                    <Text>加友</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))

                }
                {/*{*/}
                {/*    chatSpacesSearchResult.groups.map((item: any) => (*/}
                {/*        <Pressable onPress={() => sendAddFriendRequest(item.userId)}>*/}
                {/*            <Text>{item.groupName}-{item.introduction}-{item.groupAvatar}</Text>*/}
                {/*        </Pressable>*/}
                {/*    ))*/}
                {/*}*/}
            </View>
            {/*<ScrollView style={styles.resultContainer}>*/}
            {/*    {searchResult.users && searchResult.users.length !== 0 &&*/}
            {/*        <View*/}
            {/*            style={[styles.card, { borderColor: themes['color-primary-500'] }]}*/}
            {/*        >*/}
            {/*            <View style={styles.headerContainer}>*/}
            {/*                /!*<Text style={styles.headerText}>{value} - 用户</Text>*!/*/}
            {/*                <Text style={styles.headerText}>用户</Text>*/}
            {/*                <Pressable>*/}
            {/*                    <Text style={styles.headerText}>{'更多 > '}</Text>*/}
            {/*                </Pressable>*/}
            {/*            </View>*/}
            {/*            <View style={[styles.divider, { borderColor: themes['color-primary-500'] }]} />*/}
            {/*            {searchResult.users.slice(0, 5).map((item: any, index: number) => {*/}
            {/*                return (*/}
            {/*                    <View key={index} style={styles.item}>*/}
            {/*                        {!item.avatar &&*/}
            {/*                            <Icon*/}
            {/*                                style={styles.avatar}*/}
            {/*                                name="person"*/}
            {/*                                fill={themes['color-primary-500']}*/}
            {/*                            />*/}
            {/*                        }*/}
            {/*                        <View style={{ flex: 1 }}>*/}
            {/*                            <View style={{ flexDirection: 'row' }}>*/}
            {/*                                <View style={styles.contentContainer}>*/}
            {/*                                    <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>*/}
            {/*                                    <Text style={styles.introduction} numberOfLines={2} ellipsizeMode={'tail'}>{ item.introduction || '这个用户很懒, 还没有自我介绍捏 !' }</Text>*/}
            {/*                                </View>*/}
            {/*                                <Pressable onPress={() => createAddFriendRequest(item.userId)}>*/}
            {/*                                    <View style={[styles.operator, { borderColor: themes['color-primary-500'] }]}>*/}
            {/*                                        <Text>{'添加'}</Text>*/}
            {/*                                    </View>*/}
            {/*                                </Pressable>*/}
            {/*                            </View>*/}
            {/*                            { index !== 4 && <View style={[styles.divider, { borderColor: themes['color-primary-500'] }]} />}*/}
            {/*                        </View>*/}
            {/*                    </View>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </View>*/}
            {/*    }*/}
            {/*    {searchResult.chatSpaces && searchResult.chatSpaces.length !== 0 &&*/}
            {/*        <View*/}
            {/*            style={[styles.card, { borderColor: themes['color-primary-500'] }]}*/}
            {/*        >*/}
            {/*            <View style={styles.headerContainer}>*/}
            {/*                <Text style={styles.headerText}>群聊</Text>*/}
            {/*                <Pressable>*/}
            {/*                    <Text style={styles.headerText}>{'更多 > '}</Text>*/}
            {/*                </Pressable>*/}
            {/*            </View>*/}
            {/*            <View style={[styles.divider, { borderColor: themes['color-primary-500'] }]} />*/}
            {/*            {searchResult.chatSpaces.slice(0, 5).map((item: any, index: number) => {*/}
            {/*                return (*/}
            {/*                    <View key={index} style={styles.item}>*/}
            {/*                        {!item.avatar &&*/}
            {/*                            <Icon*/}
            {/*                                style={styles.avatar}*/}
            {/*                                name="person"*/}
            {/*                                fill={themes['color-primary-500']}*/}
            {/*                            />*/}
            {/*                        }*/}
            {/*                        <View style={{ flex: 1 }}>*/}
            {/*                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>*/}
            {/*                                <View style={styles.contentContainer}>*/}
            {/*                                    <View style={{ flexDirection: 'row' }}>*/}
            {/*                                        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>*/}
            {/*                                        /!*<View style={[styles.countContainer, { backgroundColor: themes['background-basic-color-2'] }]}>*!/*/}
            {/*                                        /!*    <Icon*!/*/}
            {/*                                        /!*        style={styles.countIcon}*!/*/}
            {/*                                        /!*        fill="#8F9BB3"*!/*/}
            {/*                                        /!*        name="person-outline"*!/*/}
            {/*                                        /!*    />*!/*/}
            {/*                                        /!*    <Text style={styles.countText}>{ item.count }</Text>*!/*/}
            {/*                                        /!*</View>*!/*/}
            {/*                                    </View>*/}
            {/*                                    <Text style={styles.introduction} numberOfLines={2} ellipsizeMode={'tail'}>{ item.introduction || '它的群主很懒, 还没有群聊介绍捏 !' }</Text>*/}
            {/*                                </View>*/}
            {/*                                <View style={[styles.operator, { borderColor: themes['color-primary-500'] }]}>*/}
            {/*                                    <Text>{'加入'}</Text>*/}
            {/*                                </View>*/}
            {/*                            </View>*/}
            {/*                            { index !== 4 && <View style={[styles.divider, { borderColor: themes['color-primary-500'] }]} />}*/}
            {/*                        </View>*/}
            {/*                    </View>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </View>*/}
            {/*    }*/}
            {/*</ScrollView>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        paddingHorizontal: 16,
        paddingVertical: 5,
    },
    resultContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
        marginBottom: 26,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {

    },
    divider: {
        flex: 1,
        marginHorizontal: 2,
        borderWidth: 0.5,
        marginVertical: 15,
    },
    item: {
        flexDirection: 'row',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
    },
    countContainer: {
        flexDirection: 'row',
    },
    countText: {
        lineHeight: 16,
        textAlign: 'center',
        fontSize: 12,
    },
    countIcon: {
        width: 15,
        height: 15,
    },
    introduction: {
        lineHeight: 18,
        fontSize: 12,
    },
    operator: {
        height: 45,
        // aspectRatio: 1,
        borderWidth: 1,
        borderRadius: 4,
        marginLeft: 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatSpaceAdd;
