import React, { useRef } from 'react';
import {View, StyleSheet, PanResponder, Animated, Dimensions} from 'react-native';
import {Divider, Text} from '@ui-kitten/components';
import ChatMain from '../../screens/ChatScreen';
import NoteMain from '../../screens/NoteScreen';
import QuestionMain from '../../screens/QuestionsScreen';
import ForumMain from '../../screens/ForumScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CenterCardDisplayProps = {
    navigation: any;
    selectedIndex: number;
    onBottomTabClick: (index: number) => void;
};

export const CenterCardDisplay = ({ navigation, selectedIndex, onBottomTabClick }: CenterCardDisplayProps) => {
    const selectedIndexRef = useRef(selectedIndex);
    const pan = useRef(new Animated.Value(0)).current;

    // 手势响应器配置
    const panResponder = useRef(
        PanResponder.create({
            // onStartShouldSetPanResponderCapture: (_, gestureState) => {
            //     // 捕获所有手势事件
            //     return true;
            // },
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // 只响应水平滑动
                return Math.abs(gestureState.dx) >= Math.abs(gestureState.dy);
            },
            onPanResponderMove: (_, gestureState) => {
                // 限制滑动范围 [-SCREEN_WIDTH, SCREEN_WIDTH]
                const currentIndex = selectedIndexRef.current;
                const newX = Math.max(-SCREEN_WIDTH, Math.min(gestureState.dx, SCREEN_WIDTH));
                const baseX = currentIndex * -SCREEN_WIDTH;
                // clampedX
                pan.setValue(baseX + newX);
            },
            onPanResponderRelease: (_, gestureState) => {
                // 判断滑动方向
                const currentIndex = selectedIndexRef.current;
                // console.log('手势滑动总距离', gestureState.dx);
                // console.log('当前选择index', currentIndex);
                if (gestureState.dx < -SCREEN_WIDTH * 0.1 && currentIndex < 3) {
                    // console.log('向右滑动到关注');
                    // animateToPosition(currentIndex + 1);
                    onBottomTabClick(currentIndex + 1);
                } else if (gestureState.dx > SCREEN_WIDTH * 0.1 && currentIndex > 0) {
                    // console.log('向左滑动到推荐');
                    // animateToPosition(currentIndex - 1);
                    onBottomTabClick(currentIndex - 1);
                } else {
                    // console.log('滑动复位');
                    animateToPosition(selectedIndexRef.current);
                }
            },
        })
    ).current;

    // 动画到指定位置
    const animateToPosition = React.useCallback((index: number) => {
        // console.log(selectedIndexRef.current, 'to',index);
        Animated.spring(pan, {
            toValue: index * -SCREEN_WIDTH,
            useNativeDriver: true,
            tension: 30,
            friction: 8,
        }).start();
    }, [pan]);

    React.useEffect(() => {
        const listener = pan.addListener(value => {
            // console.log('pan value:', value.value);
        });

        // 清除监听器
        return () => {
            pan.removeListener(listener);
        };
    }, [pan]);

    React.useEffect(() => {
        // 初始化时，设置默认选中的 tab
        selectedIndexRef.current = selectedIndex;
        animateToPosition(selectedIndex);
        // console.log('selectedIndex', selectedIndex);
    }, [selectedIndex]);

    return (
        <View style={styles.container}>
            {/* 滑动内容区域 */}
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        transform: [{ translateX: pan }],
                        width: SCREEN_WIDTH * 4,
                    },
                ]}
                {...panResponder.panHandlers}
            >
                {/* 消息模块 */}
                <View style={[styles.page, { left: 0 }]}>
                    <ChatMain navigation={navigation}/>
                </View>

                {/* 笔记模块 */}
                <View style={[styles.page, { left: SCREEN_WIDTH }]}>
                    <NoteMain navigation={navigation}/>
                </View>

                {/* 题库模块 */}
                <View style={[styles.page, { left: SCREEN_WIDTH * 2 }]}>
                    <Text>题库</Text>
                </View>

                {/* 论坛模块 */}
                <View style={[styles.page, { left: SCREEN_WIDTH * 3 }]}>
                    <ForumMain navigation={navigation}/>

                </View>
            </Animated.View>
            <Divider />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative',
    },
    page: {
        width: SCREEN_WIDTH,
        height: '100%',
        position: 'absolute',
    },
});
