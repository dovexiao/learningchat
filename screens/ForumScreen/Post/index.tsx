import React from 'react';
import {NavigationProps} from '../../../types/navigationType.tsx';
import {Divider, Input, Text, TopNavigationAction, ViewPager} from '@ui-kitten/components';
import {SafeAreaView, TouchableOpacity, View, StyleSheet, Image, ScrollView, Alert, Keyboard} from 'react-native';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import * as CommonIcons from '../../../component/Icon';
import * as ForumApi from '../../../services/api/ForumApi';
import {errAlert} from '../../../component/Alert/err.tsx';
import ImageView from 'react-native-image-viewing';
import {useAuth} from '../../../hooks/AuthContext.tsx';

type Reply = {
    replyId: number;
    content: string;
    createTime: string;
    username: string;
    nickname: string;
    repliedUsername: string;
    repliedNickname: string;
};

type Comment = {
    commentId: number;
    content: string;
    createTime: string;
    username: string;
    nickname: string;
    replies: Reply[];
};

type ImageItem = {
    type: string;
    width: number;
    height: number;
    base64: string;
};

type Post = {
    postId: number;
    content: string;
    tags: string[];
    cover: ImageItem;
    images: ImageItem[];
    likes: number;
    views: number;
    createTime: string;
    username: string;
    nickname: string;
    comments: Comment[];
};

const Post: React.FC<NavigationProps> = ({ navigation, route }) => {
    const partPost: Post = route.params.item || {};
    const [post, setPost] = React.useState<Post>({
        ...partPost,
        comments: [],
        images:[],
    });
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [images, setImages] = React.useState<ImageItem[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [isImageViewVisible, setIsImageViewVisible] = React.useState(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const postId = React.useRef<number | undefined>(post?.postId);
    const [inputValue, setInputValue] = React.useState('');
    const [isReplying, setIsReplying] = React.useState(false);
    const [replyingComment, setReplyingComment] = React.useState<Comment | null>(null);
    const inputRef = React.useRef<any>(null);
    const { userId } = useAuth().getUser();

    // 待考虑作为Title的render
    const renderTitleAccessory = (): React.ReactElement => (
        <View>
            <Text>{post?.username}</Text>
            <Text>{post?.createTime}</Text>
        </View>
    );

    // 跳转评论详情
    const handleCommentClick = (comment: Comment) => {
        navigation.navigate('Comment', { comment });
    };

    // 处理点击全览图片
    const handleImagePress = (index: number) => {
        setCurrentImageIndex(index);
        setIsImageViewVisible(true);
    };

    // 渲染图片轮播
    const renderImageCarousel = () => {
        if (!images || images.length === 0) {
            return null;
        }

        return (
            <View style={styles.imageContainer}>
                <ViewPager
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}
                    style={styles.viewPager}
                >
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            onPress={() => handleImagePress(index)}
                        >
                            <Image
                                source={{ uri: `data:${image.type};base64,${image.base64}` }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ViewPager>
                {images.length > 1 && (
                    <View style={styles.pagination}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === selectedIndex && styles.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    // 处理发送
    const handleSubmit = async () => {
        if (!inputValue.trim() || !postId.current) {return;}
        try {
            if (isReplying && replyingComment) {
                // 回复评论
                const response = await ForumApi.replyComment(replyingComment.commentId, userId, NaN, inputValue);
                const newComments = comments.map((comment) => {
                    if (response.comment && comment.commentId === response.comment?.commentId) {
                        return response.comment;
                    } else {
                        return comment;
                    }
                });
                setComments(newComments);
                setPost({...post, comments: comments || []});
            } else {
                // 评论帖子
                const response = await ForumApi.commentPost(postId.current, userId, inputValue);
                setPost({...post, comments: response.comments || []});
                setComments(response.comments || []);
            }
            setInputValue('');
            setIsReplying(false);
            setReplyingComment(null);
            Keyboard.dismiss();
        } catch (error) {
            errAlert(error);
        }
    };

    // 处理回复评论
    const handleCommentPress = (comment: Comment) => {
        setIsReplying(true);
        setReplyingComment(comment);
        setInputValue('');
        inputRef.current?.focus();
    };

    // 处理评论帖子
    const handleInputPress = () => {
        setInputValue('');
    };

    const handleOnBlur = () => {
        setInputValue('');
        setIsReplying(false);
        setReplyingComment(null);
    };

    // 获取帖子详情
    const getPostDetail = React.useCallback(async () => {
        try {
            if (postId.current) {
                const wholePost = (await ForumApi.getPostDetail(postId.current)).post;
                postId.current = wholePost.postId;
                setPost(wholePost);
                setComments(wholePost.comments || []);
                setImages(wholePost.images || []);
            }
        } catch (error) {
            errAlert(error);
        }
    }, []);

    React.useEffect(() => {
        (async () => {
            await getPostDetail();
        })();
    }, [getPostDetail]);

    return (
        <SafeAreaView style={styles.container}>
            <TopNavigationOpe
                navigation={navigation}
                renderItemAccessory={renderRightActions}
                // title={renderTitleAccessory}
                title={post?.username}
            />

            <Divider />

            <ScrollView>
                {/* 图片 */}
                {renderImageCarousel()}

                {/* 内容 */}
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{post?.content}</Text>
                </View>

                {/* 标签 */}
                <View style={styles.tagsContainer}>
                    {post?.tags.map((tag, index) => (
                        <View key={index} style={styles.tagItem}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* 其他信息 */}
                <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>浏览量{post?.views}</Text>
                    <View style={styles.metaIconText}>
                        <View style={styles.metaIcon}>
                            {CommonIcons.CommentIcon({})}
                        </View>
                        <Text style={styles.metaText}>{post?.comments.length}</Text>
                    </View>
                    <View style={styles.metaIconText}>
                        <View style={styles.metaIcon}>
                            {CommonIcons.LikeShallowIcon({})}
                        </View>
                        <Text style={styles.metaText}>{post?.likes}</Text>
                    </View>
                </View>

                <Divider />
                <Divider />

                {/* 评论区 */}
                <View style={styles.commentsContainer}>
                    <View style={styles.commentsHeader}>
                        {post?.comments.length > 0 && (
                            <Text style={styles.commentsCount}>{post?.comments.length}条评论</Text>
                        )}
                    </View>

                    {/* 评论列表 */}
                    {comments.map(comment => (
                        <View key={comment.commentId} style={styles.commentItem}>
                            {/* 头像 */}
                            <View style={styles.avatarContainer}>
                                <TopNavigationAction
                                    icon={CommonIcons.PersonIcon}
                                />
                            </View>

                            {/* 评论内容 */}
                            <View style={styles.commentContent}>
                                {/* 用户名和时间 */}
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentUsername}>{comment.username}</Text>
                                    <Text style={styles.commentTime}>{comment.createTime}</Text>
                                </View>

                                {/* 评论正文 */}
                                <TouchableOpacity onPress={() => handleCommentPress(comment)}>
                                    <Text style={styles.commentText}>{comment.content}</Text>
                                </TouchableOpacity>


                                {/* 回复区 */}
                                {comment.replies.length > 0 && (
                                    <View style={styles.repliesContainer}>
                                        {/* 显示前两条回复 */}
                                        {comment.replies.slice(0, 2).map(reply => (
                                            <View key={reply.replyId} style={styles.replyItem}>
                                                <Text style={styles.replyUsername}>{reply.nickname ? reply.nickname : `用户 ${reply.username}`}: </Text>
                                                <Text style={styles.replyText}>{reply.content}</Text>
                                            </View>
                                        ))}

                                        {/* 查看更多回复 */}
                                        {comment.replies.length > 2 && (
                                            <TouchableOpacity onPress={() => {handleCommentClick(comment);}}>
                                                <View style={styles.viewMoreReplies}>
                                                    <Text style={styles.viewMoreText}>查看{comment.replies.length}条回复{'>'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/*评论回复*/}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    {/*<Text style={styles.inputPrefix}>*/}
                    {/*    {isReplying ? '回复该评论：' : '评论该帖子：'}*/}
                    {/*</Text>*/}
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        placeholder="加入讨论..."
                        style={styles.input}
                        onFocus={handleInputPress}
                        onBlur={handleOnBlur}
                        onChangeText={setInputValue}
                        multiline
                    />
                </View>
                <View style={styles.sendButton}>
                    <TopNavigationAction
                        icon={CommonIcons.SendIcon}
                        onPress={handleSubmit}
                    />
                </View>
                <View style={styles.sendButton}>
                    <TopNavigationAction
                        icon={CommonIcons.LikeIcon}
                        onPress={() => {Alert.alert('点赞');}}
                    />
                </View>
            </View>

            {/*全览图片*/}
            <ImageView
                images={images && images.map(img => ({
                    uri: `data:${img.type};base64,${img.base64}`,
                }))}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
                animationType="fade"
                backgroundColor="black"
            />
        </SafeAreaView>
    );
};

// 操作项
const renderRightActions = (): React.ReactElement => (
    <TopNavigationAction
        icon={CommonIcons.MoreOpeIcon}
        onPress={() => {Alert.alert('更多操作');}}
    />
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    imageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
    },
    viewPager: {
        width: '100%',
        height: 250,
    },
    image: {
        width: '100%',
        height: 250,
    },
    pagination: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: 'white',
    },
    contentContainer: {
        padding: 16,
        width: '100%',
    },
    contentText: {
        fontSize: 17,
        lineHeight: 25,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingBottom: 5,
    },
    tagItem: {
        backgroundColor: '#e1f5fe',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
    },
    tagText: {
        color: '#039be5',
        fontSize: 12,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    metaText: {
        color: '#757575',
        fontSize: 14,
    },
    metaIconText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 26,
    },
    metaIcon: {
        width: 20,
        height: 20,
    },
    commentsContainer: {
        padding: 16,
    },
    commentsHeader: {
        marginBottom: 20,
    },
    commentsCount: {
        fontSize: 14,
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    avatarContainer: {
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 4,
    },
    commentUsername: {
        fontWeight: 'bold',
        marginRight: 8,
        fontSize: 15,
    },
    commentTime: {
        color: '#757575',
        fontSize: 12,
    },
    commentText: {
        fontSize: 17,
        // lineHeight: 20,
        marginVertical: 10,
    },
    repliesContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    replyItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    replyUsername: {
        color: '#039be5',
        fontSize: 13,
    },
    replyText: {
        color: '#757575',
        fontSize: 13,
        flex: 1,
    },
    viewMoreReplies: {
        marginTop: 4,
    },
    viewMoreText: {
        color: '#039be5',
        fontSize: 13,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    inputWrapper: {
        flex: 1,
        marginRight: 8,
    },
    inputPrefix: {
        position: 'absolute',
        left: 12,
        top: 12,
        zIndex: 1,
        color: '#757575',
        fontSize: 14,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        borderWidth: 0,
    },
    sendButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Post;
