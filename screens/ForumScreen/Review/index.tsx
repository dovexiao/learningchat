import React from 'react';
import {NavigationProps} from "../../../types/navigationType.tsx";
import {Divider, Input, Text, TopNavigationAction} from '@ui-kitten/components';
import {Alert, SafeAreaView, TouchableOpacity, View} from "react-native";
import TopNavigationOpe from "../../../component/TopNavigation/TopNavigationOpe.tsx";
import * as CommonIcons from "../../../component/Icon";

const Post: React.FC<NavigationProps> = ({ navigation, route }) => {
    const post = route.params.item;

    const renderRightActions = (): React.ReactElement => (
        <></>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe
                navigation={navigation}
                renderItemAccessory={renderRightActions}
                title={post.username}
            />
            <Divider />
            {/*评论*/}
            <View>
                {/*头像*/}
                <View>
                    <TopNavigationAction
                        icon={CommonIcons.PersonIcon}
                    />
                </View>
                <View>
                    {/*用户名*/}
                    <View></View>
                    {/*评论时间*/}
                    <View></View>
                    {/*评论内容*/}
                    <View></View>
                </View>
            </View>
            <Divider />
            <Divider />
            {/*回复区*/}
            <View>
                <View>
                    <Text>{}条回复</Text>
                </View>
                {/*回复*/}
                <View>
                    {/*头像*/}
                    <View>
                        <TopNavigationAction
                            icon={CommonIcons.PersonIcon}
                        />
                    </View>
                    <View>
                        {/*用户名*/}
                        <View></View>
                        {/*回复时间*/}
                        <View></View>
                        {/*回复内容*/}
                        <View></View>
                    </View>
                </View>
            </View>
            {/*输入操作区*/}
            <View>
                <View>
                    <Input />
                </View>
                <View>
                    <TopNavigationAction
                        icon={CommonIcons.SendIcon}
                        onPress={() => {Alert.alert('发送');}}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Post;
