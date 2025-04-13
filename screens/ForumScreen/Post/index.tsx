import React from 'react';
import {NavigationProps} from "../../../types/navigationType.tsx";
import {Divider, Text, TopNavigationAction} from '@ui-kitten/components';
import {SafeAreaView, TouchableOpacity, View} from "react-native";
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
            {/*图片*/}
            <View></View>
            {/*内容*/}
            <View></View>
            {/*标签*/}
            <View></View>
            {/*其他信息*/}
            <View style={{flexDirection: 'row'}}>
                <Text>浏览量</Text>
                <Text>views</Text>
                {CommonIcons.ReviewIcon({})}
                <Text>reviews</Text>
                {CommonIcons.LikeIcon({})}
                <Text>likes</Text>
            </View>
            <Divider />
            <Divider />
            {/*评论区*/}
            <View>
                <View>
                    <Text>{}条评论</Text>
                </View>
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
                        {/*回复区*/}
                        <View>
                            {/*回复*/}
                            <View>
                                {/*用户名*/}
                                <View></View>
                                {/*回复内容*/}
                                <View></View>
                            </View>
                            <TouchableOpacity>
                                <View>
                                    <Text>查看{}条回复{'>'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Post;
