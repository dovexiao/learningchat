import {
    Divider,
    Layout,
    TopNavigationAction,
    Text,
    useTheme,
    ViewPager
} from '@ui-kitten/components';
import React from 'react';
import {Dimensions, Image, Pressable, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import {NavigationProps} from '../../types/navigationType.ts';
// import * as CommonIcon from '../../component/Icon';
import DoubleColWaterfallList from '../../component/List/DoubleColWaterfallList.tsx';
import * as CommonIcons from '../../component/Icon';
import {useAuth} from '../../hooks/AuthContext.tsx';
import * as ForumApi from '../../services/api/ForumApi';
import {errAlert} from '../../component/Alert/err.tsx';
import FastImage from 'react-native-fast-image';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {saveImageToFile} from '../../services/storage/ImageCache.ts';
import {useGlobal} from "../../hooks/GlobalContext.tsx";

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

const { width: screenWidth } = Dimensions.get('window');

const ForumMain: React.FC<NavigationProps> = ({ navigation }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const themes = useTheme();
    const { userId } = useGlobal();

    const handleAddPostClick = () => {
        navigation.navigate('PostTI');
    };

    // 获取下一页帖子数据
    const getNextPosts = async () => {
        try {
            const { posts } = await ForumApi.getPosts(userId);
            console.log(posts);
            return await Promise.all(posts.map(async (post: Post) => {
                let path = '';
                if (post.cover && post.cover.base64) {
                    path = await saveImageToFile(post.cover.base64, 'POSTS');
                }
                console.log(path);
                return {
                    ...post,
                    cover: {
                        localPath: path,
                        type: post.cover?.type,
                        width: post.cover?.width,
                        height: post.cover?.height,
                        base64: !(!post.cover?.base64),
                    },
                    navigation: navigation,
                };
            }));
        } catch (error) {
            errAlert(error);
        }
    };

    // 估计列表项高度
    const estimateListItemHeight = (item: any, index: number) => {
        const width = (screenWidth  - 40) / 2;

        let totalHeight = Number(0);

        let imageHeight = Number(0);
        if (item.cover && item.cover.base64) {
            const coverWidth = item.cover.width;
            const coverHeight = item.cover.height;
            const aspectRatio = Math.max(coverWidth / coverHeight, 0.8);
            // console.log(`cover${index} :`, coverWidth, coverHeight);
            // console.log(`aspectRatio${index} :`, aspectRatio);
            imageHeight = width / aspectRatio;
            // console.log(`imageView${index}高度 :`, imageHeight);
            totalHeight += imageHeight;
        }

        const fontSize = Number(16);
        const lineHeight = Number(24);
        const avgCharWidth = fontSize / 2;
        const maxCharsPerLine = (width - 20) / avgCharWidth;
        const text = item.content.trim();
        let totalLines = Number(0);
        let currentLineChars = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                totalLines++;
                currentLineChars = 0;
            } else {
                currentLineChars++;
                if (currentLineChars > maxCharsPerLine) {
                    totalLines++;
                    currentLineChars = 1; // 当前行的第一个字符
                }
            }
        }
        if (currentLineChars > 0) {
            totalLines++;
        }
        const textViewPaddingVertical = Number(10);
        const textViewHeight = totalLines * lineHeight + textViewPaddingVertical;
        // console.log(`textView${index}高度 :`, textViewHeight);
        // totalHeight += textViewHeight;
        totalHeight += textViewPaddingVertical + lineHeight;

        const tagsViewHeight = Number(item.tags.length !== 0 ? 31 : 0);
        // console.log(`tagsView${index}高度 :`, tagsViewHeight);
        totalHeight += tagsViewHeight;

        const metaViewHeight = Number(44);
        // console.log(`metaView${index}高度 :`, metaViewHeight);
        totalHeight += metaViewHeight;

        return {
            width,
            totalHeight,
            imageHeight,
            textViewHeight,
            tagsViewHeight,
            metaViewHeight,
        };
    };

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationAvatar
                navigation={navigation}
                renderItemAccessory={renderOpeAccessory}
            />
            <Divider />
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setSelectedIndex(0)}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.tabText,
                        selectedIndex === 0 ? styles.activeTab : styles.inactiveTab
                    ]}>
                        推荐
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setSelectedIndex(1)}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.tabText,
                        selectedIndex === 1 ? styles.activeTab : styles.inactiveTab
                    ]}>
                        关注
                    </Text>
                </TouchableOpacity>
            </View>
            <ViewPager
                style={{ flex: 1 }}
                selectedIndex={selectedIndex}
                swipeEnabled={true}
                onSelect={index => setSelectedIndex(index)}
            >
                <Layout style={{ flex: 1, backgroundColor: themes['background-basic-color-2']}}>
                    <View style={{ flex: 1, display: selectedIndex === 0 ? 'flex' : 'none' }}>
                        <DoubleColWaterfallList
                            // skeletonItem={skeletonItem}
                            renderListItem={RenderListItem}
                            getNextPageData={getNextPosts}
                            estimateListItemHeight={estimateListItemHeight}
                        />
                    </View>
                </Layout>
                <Text>123</Text>
            </ViewPager>

        </SafeAreaView>
    );
};

const skeletonItem = (): React.ReactElement => (
    <View style={[styles.container, {backgroundColor: 'inherit'}]}>
        <SkeletonPlaceholder imageHeight={140} width={(screenWidth  - 40) / 2} />
    </View>
);

// 列表项render函数
const RenderListItem = ({ item, index }: { item: any, index: number }): React.ReactElement => {
    if (!item) {
        return (
            <>
                {skeletonItem()}
            </>
        );
    }

    const hasCover = item.cover && item.cover.localPath;
    let imageStyle = {};
    let imageContainerStyle = {};

    if (hasCover) {
        const { width, height } = item.cover;
        const aspectRatio = width && height ? width / height : 0.8; // 默认宽高比

        // 图片宽高比小于0.8（图片更高），超出部分遮蔽
        if (aspectRatio < 0.8) {
            imageStyle = {
                width: '100%',
                height: undefined,
                aspectRatio: aspectRatio,
                resizeMode: 'cover', // 超出部分裁剪
            };
            imageContainerStyle = {
                width: '100%',
                aspectRatio: 0.8, // 保持容器宽高比
                overflow: 'hidden', // 超出部分隐藏
            };
        }
        // 图片宽高比大于0.8（视图更高），按图片实际宽高比显示
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

    const handleListItemClick = () => {
        item.navigation.navigate('Post', { item });
    };

    return (
        <View style={{ position: 'relative' }}>
            {/*<View style={{position: 'absolute', top: 0, left: 0, zIndex: -1}}>*/}
            {/*    <SkeletonItem  height={item.listItemViewHeights.imageHeight} width={item.listItemViewHeights.width}/>*/}
            {/*</View>*/}
            <Pressable onPress={handleListItemClick}>
                <View
                    style={styles.container}
                    // onLayout={(event) => {
                    //     const { height, width } = event.nativeEvent.layout;
                    //     console.log(`container${index}可见高度:`, height);
                    //     console.log(`container${index}可见宽度:`, width);
                    // }}
                >
                    {hasCover ?
                        <View
                            style={[styles.imageContainer, imageContainerStyle]}
                            // onLayout={(event) => {
                            //     const { height, width } = event.nativeEvent.layout;
                            //     console.log(`image${index}可见高度（垂直列表）:`, height);
                            //     console.log(`image${index}可见宽度（水平列表）:`, width);
                            // }}
                        >
                            <FastImage
                                style={imageStyle}
                                source={{
                                    uri: `file://${item.cover.localPath}`,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </View>
                        : null
                    }
                    <View
                        style={styles.textContainer}
                        // onLayout={(event) => {
                        //     const { height, width } = event.nativeEvent.layout;
                        //     console.log(`text${index}可见高度（垂直列表）:`, height);
                        //     console.log(`text${index}可见宽度（水平列表）:`, width);
                        // }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={{ lineHeight: 24, fontSize: 16 }}
                        >
                            {item?.content}
                        </Text>
                    </View>
                    <View
                        style={styles.tagsContainer}
                        // onLayout={(event) => {
                        //     const { height, width } = event.nativeEvent.layout;
                        //     console.log(`tags${index}可见高度（垂直列表）:`, height);
                        //     console.log(`tags${index}可见宽度（水平列表）:`, width);
                        // }}
                    >
                        {item?.tags && item?.tags.filter((tag: string) => tag.length < 5).slice(0, 2).map((tag: string, index: number) =>
                            <View key={index} style={styles.tagItem}>
                                <Text style={styles.tagText}># {tag}</Text>
                            </View>
                        )}
                    </View>
                    <View
                        style={styles.metaContainer}
                        // onLayout={(event) => {
                        //     const { height, width } = event.nativeEvent.layout;
                        //     console.log(`meta${index}可见高度（垂直列表）:`, height);
                        //     console.log(`meta${index}可见宽度（水平列表）:`, width);
                        // }}
                    >
                        <View style={[styles.metaIconText, {flex: 1}]}>
                            {/*<TopNavigationAction*/}
                            {/*    style={styles.metaIcon}*/}
                            {/*    icon={CommonIcon.PersonIcon}*/}
                            {/*/>*/}
                            <Text style={[styles.metaText, {flex: 1}]} numberOfLines={1} ellipsizeMode={'tail'}>{item?.nickname ? item?.nickname : `用户${item?.username}`}</Text>
                        </View>
                        <View style={styles.metaIconText}>
                            {/*<TopNavigationAction*/}
                            {/*    style={styles.metaIcon}*/}
                            {/*    icon={CommonIcon.LikeIcon}*/}
                            {/*/>*/}
                            <Text style={styles.metaText}>{item?.likes}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

// 骨架屏占位
const SkeletonPlaceholder = ({width, imageHeight}: {width: number, imageHeight: number}) => (
    <ContentLoader
        speed={1.2}  // 动画速度
        backgroundColor="#f3f3f3"  // 背景色
        foregroundColor="#ecebeb"  // 前景色
        width={width}
        height={imageHeight + 109}
        viewBox={`0 0 ${width} ${imageHeight + 109}`}  // 视口宽高（需计算实际尺寸）
    >
        {/* 主图 */}
        <Rect x="0" y="0" rx="10" ry="10" width="100%" height={imageHeight} />

        {/* 第一行文本 */}
        <Rect x="0" y={imageHeight + 5} rx="4" ry="4" width="100%" height="24" />

        {/* 第二行文本（稍短） */}
        <Rect x="0" y={imageHeight + 39} rx="4" ry="4" width="100%" height="21" />

        {/* 第三行文本 */}
        <Rect x="0" y={imageHeight + 70} rx="4" ry="4" width="100%" height="24" />
    </ContentLoader>
);

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'flex-end',
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    tabItem: {
        marginHorizontal: 20,
    },
    tabText: {
        // 默认样式
        fontWeight: '500',
    },
    activeTab: {
        fontSize: 25,
        // color: '#FF4500',    // 选中颜色
    },
    inactiveTab: {
        fontSize: 20,
        color: '#666',       // 未选中颜色
    },
    container: {
        // width: '100%',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginHorizontal: 5,
        marginVertical: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        aspectRatio: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    imagePlaceholder: {
        color: '#999',
        fontSize: 16,
    },
    textContainer: {
        // marginVertical: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        // flexWrap: 'nowrap',
        overflow: 'hidden',
    },
    tagItem: {
        backgroundColor: '#e1f5fe',
        borderRadius: 5,
        padding: 4,
        marginVertical: 4,
        marginRight: 5,
    },
    tagText: {
        color: '#039be5',
        fontSize: 11,
    },
    metaContainer: {
        width: '100%',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // paddingHorizontal: 10,
        paddingVertical: 10,
        paddingRight: 10,
    },
    metaIconText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        width: 18,
        height: 18,
    },
    metaText: {
        fontSize: 11,
    },
});

export default ForumMain;
