import {Divider, Layout, Tab, TabBar, TopNavigationAction, Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import {NavigationProps} from '../../types/navigationType.tsx';
import * as CommonIcon from '../../component/Icon';
import DoubleColWaterfallList from '../../component/List/DoubleColWaterfallList.tsx';
import * as CommonIcons from '../../component/Icon';
import {useAuth} from '../../hooks/AuthContext.tsx';
import * as api from '../../services/api/ForumApi';
import {errAlert} from '../../component/Alert/err.tsx';

type ImageItem = {
    type: string | undefined;
    width: number | undefined;
    height: number | undefined;
    base64: string | undefined;
};

type Post = {
    postId: number;
    content: string;
    tags: string[];
    cover: ImageItem;
    likes: number;
    views: number;
    createTime: string;
    username: string;
    nickname: string;
};

const data2 = new Array(10).fill({
    content: '题目集: 12345',
    tags: '前端,后端,测试',
    username: '123',
    cover: '封面',
    Likes: 10,
});

const ForumMain: React.FC<NavigationProps> = ({ navigation }) => {
    const [postData, setPostData] = React.useState<Post[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const themes = useTheme();
    const { userId } = useAuth().getUser();

    const handleListItemClick = (item: any) => {
        navigation.navigate('Post', { item });
    };

    const handleAddPostClick = () => {
        navigation.navigate('PostTI');
    };

    const getPosts = React.useCallback(async () => {
        try {
            const { posts } = await api.getPosts(userId);
            setPostData(posts);
        } catch (error) {
            errAlert(error);
        }
    }, [userId]);

    const renderOpeAccessory = () => (
        <View style={{ flexDirection: 'row' }} >
            <TopNavigationAction
                icon={CommonIcons.SearchIcon}
                onPress={() => {}}
            />
            <TopNavigationAction
                icon={CommonIcons.MessageIcon}
                onPress={() => {}}
            />
            <TopNavigationAction
                icon={CommonIcons.AddIcon}
                onPress={handleAddPostClick}
            />
        </View>
    );

    React.useEffect(() => {
        (async () => {
            await getPosts();
        })();
    }, [getPosts]);

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
                <Tab title="推荐" style={{height: 40}} />
                <Tab title="关注" style={{height: 40}} />
            </TabBar>
            <Layout style={{ flex: 1, backgroundColor: themes['background-basic-color-2']}}>
                {
                    selectedIndex === 0 ?
                        <DoubleColWaterfallList
                            data={postData}
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
    const hasCover = item.cover && item.cover.base64;
    let imageStyle = {};
    let imageContainerStyle = {};

    if (hasCover) {
        const { width, height } = item.cover;
        const aspectRatio = width && height ? width / height : 0.7; // 默认宽高比

        // 图片宽高比小于0.7（图片更高），超出部分遮蔽
        if (aspectRatio < 0.7) {
            imageStyle = {
                width: '100%',
                height: undefined,
                aspectRatio: aspectRatio,
                resizeMode: 'cover', // 超出部分裁剪
            };
            imageContainerStyle = {
                width: '100%',
                aspectRatio: 0.7, // 保持容器宽高比
                overflow: 'hidden', // 超出部分隐藏
            };
        }
        // 图片宽高比大于0.7（视图更高），按图片实际宽高比显示
        else {
            imageStyle = {
                width: '100%',
                height: undefined,
                aspectRatio: aspectRatio,
                resizeMode: 'contain', // 完整显示图片
            };
            imageContainerStyle = {
                width: '100%',
                aspectRatio: aspectRatio, // 容器跟随图片比例
            };
        }
    }

    return (
        <View style={styles.container}>
            {hasCover ? (
                <View style={[styles.imageContainer, imageContainerStyle]}>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${item?.cover.base64}` }}
                        style={imageStyle}
                    />
                </View>
            ) : null}
            {/*<View style={styles.imageContainer}>*/}
            {/*    <Text style={styles.imagePlaceholder}>图片占位</Text>*/}
            {/*</View>*/}
            <View style={styles.contentContainer}>
                <Text numberOfLines={3} ellipsizeMode={'tail'}>{item?.content}</Text>
            </View>
            <View style={styles.tagsContainer}>
                {item?.tags && item?.tags.map((tag: string, index: number) => (
                    <View key={index} style={styles.tagItem}>
                        <Text style={styles.tagText}># {tag}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.metaContainer}>
                <View style={styles.metaIconText}>
                    <TopNavigationAction
                        icon={CommonIcon.PersonIcon}
                    />
                    <Text>{item?.nickname ? item?.nickname : `用户 ${item?.username}`}</Text>
                </View>
                <View style={styles.metaIconText}>
                    <TopNavigationAction
                        icon={CommonIcon.LikeIcon}
                    />
                    <Text>{item?.likes}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: '#fff',
        marginHorizontal: 5,
        marginBottom: 10,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.7,
        backgroundColor: '#f0f0f0',
    },
    imagePlaceholder: {
        color: '#999',
        fontSize: 16,
    },
    contentContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        // marginVertical: 10
    },
    tagItem: {
        backgroundColor: '#e1f5fe',
        borderRadius: 5,
        paddingVertical: 4,
        marginRight: 8,
    },
    tagText: {
        color: '#039be5',
        fontSize: 12,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 10,
        paddingRight: 10,
        marginVertical: 10,
    },
    metaIconText: {
        flexDirection: 'row',
    },
});

export default ForumMain;
