import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import {useTheme} from '@ui-kitten/components';

export type MessageHandle = {
    show: (content: string) => void;
};

const Message = forwardRef<MessageHandle>((_, ref) => {
    const [content, setContent] = useState('');
    const animValue = useRef(new Animated.Value(-150)).current;
    const themes = useTheme();

    const showAnimation = Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    });

    const hideAnimation = Animated.timing(animValue, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
    });

    useImperativeHandle(ref, () => ({
        show: (msg: string) => {
            setContent(msg);
            showAnimation.start(() => {
                setTimeout(() => {
                    hideAnimation.start();
                }, 3000);
            });
        },
    }));

    if (!content) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: animValue }] },
            ]}
        >
            <View style={[styles.messageBox, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <Text style={{ color: '#fff' }}>{content}</Text>
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        width: '100%',
        alignItems: 'center',
        zIndex: 999,
    },
    messageBox: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        // 自行添加背景色和文字样式
    },
});

export default Message;
