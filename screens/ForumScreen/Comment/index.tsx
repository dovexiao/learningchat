import React from 'react';
import {NavigationProps} from '../../../types/navigationType.tsx';
import {Divider, Input, Text, TopNavigationAction} from '@ui-kitten/components';
import {Alert, SafeAreaView, View, StyleSheet, ScrollView, TouchableOpacity, Keyboard} from 'react-native';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import * as CommonIcons from '../../../component/Icon';
import {useAuth} from '../../../hooks/AuthContext.tsx';
import * as ForumApi from '../../../services/api/ForumApi.ts';
import {errAlert} from '../../../component/Alert/err.tsx';

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

const Comment: React.FC<NavigationProps> = ({ navigation, route }) => {
    const initialComment: Comment = route.params.comment || {};
    const [comment, setComment] = React.useState<Comment>(initialComment);
    const commentId = React.useRef<number | undefined>(comment?.commentId);
    const [inputValue, setInputValue] = React.useState('');
    const [replyingReply, setReplyingReply] = React.useState<Reply | null>(null);
    const inputRef = React.useRef<any>(null);
    const { userId } = useAuth().getUser();

    const renderRightActions = (): React.ReactElement => (
        <TopNavigationAction
            icon={CommonIcons.MoreOpeIcon}
            onPress={() => {Alert.alert('更多操作');}}
        />
    );

    // 处理发送
    const handleSubmit = async () => {
        if (!inputValue.trim() || !commentId.current) {return;}

        try {
            const replyId = replyingReply ? replyingReply.replyId : NaN;
            const response = await ForumApi.replyComment(commentId.current, userId, replyId, inputValue);
            setComment(response.comment);
            Keyboard.dismiss();
        } catch (error) {
            errAlert(error);
        }
    };

    // 处理回复回复
    const handleReplyPress = (reply: Reply) => {
        setReplyingReply(reply);
        setInputValue('');
        inputRef.current?.focus();
    };

    // 处理评论回复
    const handleInputPress = () => {
        setInputValue('');
    };

    const handleOnBlur = () => {
        setInputValue('');
        setReplyingReply(null);
    };

    // 获取评论详情
    const getCommentDetail = React.useCallback(async () => {
        try {
            if (commentId.current) {
                const newComment = (await ForumApi.getCommentDetail(commentId.current)).comment;
                commentId.current = newComment.commentId;
                setComment(newComment);
            }
        } catch (error) {
            errAlert(error);
        }
    }, []);

    React.useEffect(() => {
        (async () => {
            await getCommentDetail();
        })();
    }, [getCommentDetail]);

    return (
        <SafeAreaView style={styles.container}>
            <TopNavigationOpe
                navigation={navigation}
                renderItemAccessory={renderRightActions}
                title={'评论详情'}
            />

            <Divider />

            <ScrollView>
                {/* 主评论 */}
                <View style={styles.commentContainer}>
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
                            <Text style={styles.username}>{comment?.username}</Text>
                            <Text style={styles.commentTime}>{comment?.createTime}</Text>
                        </View>

                        {/* 评论正文 */}
                        <Text style={styles.commentText}>{comment?.content}</Text>
                    </View>
                </View>

                <Divider />
                <Divider />

                {/* 回复区 */}
                <View style={styles.repliesContainer}>
                    <View style={styles.repliesHeader}>
                        <Text style={styles.repliesCount}>{comment?.replies.length}条回复</Text>
                    </View>

                    {/* 回复列表 */}
                    {comment?.replies.map(reply => (
                        <View key={reply.replyId} style={styles.replyItem}>
                            {/* 头像 */}
                            <View style={styles.avatarContainer}>
                                <TopNavigationAction
                                    icon={CommonIcons.PersonIcon}
                                />
                            </View>

                            {/* 回复内容 */}
                            <View style={styles.replyContent}>
                                {/* 回复头部 */}
                                <View style={styles.replyHeader}>
                                    <Text style={styles.replyUsername}>{reply.username}</Text>
                                    <Text style={styles.replyTime}>{reply.createTime}</Text>
                                </View>

                                {/* 回复正文 */}
                                <TouchableOpacity onPress={() => handleReplyPress(reply)}>
                                    <View style={styles.replyText}>
                                        {reply.repliedUsername && (
                                            <View style={{flexDirection: 'row'}}>
                                                <Text>回复</Text>
                                                <Text style={styles.replayMark}> @{reply.repliedNickname ? reply.repliedNickname : `用户 ${reply.repliedUsername}`}</Text>
                                                <Text>:  </Text>
                                            </View>
                                        )}
                                        <Text>{reply.content}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

             {/*输入操作区*/}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
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
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
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
    username: {
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
        // lineHeight: 25,
        marginTop: 10,
    },
    repliesContainer: {
        padding: 16,
    },
    repliesHeader: {
        marginBottom: 20,
    },
    repliesCount: {
        fontSize: 14,
    },
    replyItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    replyContent: {
        flex: 1,
    },
    replyHeader: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 4,
    },
    replyUsername: {
        fontWeight: 'bold',
        marginRight: 8,
        fontSize: 15,
    },
    replyTime: {
        color: '#757575',
        fontSize: 12,
    },
    replyText: {
        flexDirection: 'row',
        fontSize: 17,
        marginVertical: 10,
    },
    replayMark: {
        color: '#039be5',
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

export default Comment;
