import {Divider, type IconElement, Layout, Tab, TabBar, TopNavigationAction, Text} from '@ui-kitten/components';
import React from 'react';
import {Alert, SafeAreaView, TouchableOpacity, View} from 'react-native';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import {NavigationProps} from '../../types/navigationType.tsx';
import * as CommonIcon from '../../component/Icon';
import DoubleColWaterfallList from "../../component/List/DoubleColWaterfallList.tsx";

const data1 = new Array(10).fill({
    content: '题目集: 12345非技术类翻了翻是否能顺利方式31314141',
    tags: '前端,后端,测试',
    username: '123',
    cover: '封面',
    Likes: 5,
});

const data2 = new Array(10).fill({
    content: '题目集: 12345',
    tags: '前端,后端,测试',
    username: '123',
    cover: '封面',
    Likes: 10,
});

const ForumMain: React.FC<NavigationProps> = ({ navigation }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleListItemClick = (item: any) => {
        navigation.navigate('Post', { item });
    };

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
            <TabBar
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}
            >
                <Tab title="推荐" style={{height: 40}}/>
                <Tab title="关注" />
            </TabBar>
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                {
                    selectedIndex === 0 ?
                        <DoubleColWaterfallList
                            data={data1}
                            onListItemClick={handleListItemClick}
                            renderListItem={renderListItem}
                        /> :
                        selectedIndex === 1 ?
                            <DoubleColWaterfallList
                                data={data2}
                                onListItemClick={handleListItemClick}
                                renderListItem={renderListItem}
                            /> :
                            <></>
                }
            </Layout>
        </SafeAreaView>
    );
};

const renderListItem = (item: any): React.ReactElement => {
    const onListItemClick = (): void => {

    };

    return (
        <View style={{width: '100%', padding: 10}}>
            <View style={{width: '100%'}}>
                <Text style={{width: '100%', aspectRatio: 0.7}}>{item.cover}</Text>
            </View>
            <View style={{ marginVertical: 10 }}>
                <Text numberOfLines={3} ellipsizeMode={'tail'}>{item.content}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                {item.tags.split(',').map((tag: string) => (
                    <View key={tag}>
                        <Text>#{tag}</Text>
                    </View>
                ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <Text>{item.username}</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity>
                        <CommonIcon.LikeIcon onPress={onListItemClick}/>
                    </TouchableOpacity>
                    <Text>{item.Likes}</Text>
                </View>
            </View>
        </View>
    );
};

export default ForumMain;
