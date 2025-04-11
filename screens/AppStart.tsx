import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { NavigationProps } from '../types/navigationType.tsx';
import { useTheme } from '@ui-kitten/components';
import {useAuth} from '../hooks/AuthContext.tsx';

const AppStart: React.FC<NavigationProps> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [countdown, setCountdown] = useState(2); // 2秒倒计时
    const animationRef = useRef<LottieView>(null);
    const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const themes = useTheme();
    const { isTokenExpired } = useAuth();

    const handleAnimationFinishRef = useRef(() => {
        // console.log('动画结束');
        if (isTokenExpired) {
            navigation.replace('AppMain');
        } else if (typeof isTokenExpired === 'boolean') {
            navigation.replace('AppLogin');
        } else {
            navigation.replace('AppAuthLoading');
        }
    });

    // 倒计时效果
    useEffect(() => {
        if (countdown > 0) {
            countdownRef.current = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else {
            handleAnimationFinishRef.current?.();
        }
        return () => {
            if (countdownRef.current) {
                clearTimeout(countdownRef.current);
            }
        };
    }, [countdown]);

    // 跳过处理
    const handleSkip = () => {
        // 暂停动画
        animationRef.current?.pause();
        // console.log('用户手动跳过');
        handleAnimationFinishRef.current?.();
    };

    return (
        <View style={[styles.container, { backgroundColor: themes['color-appStart-default'] }]}>
            {isLoading && (
                <View style={[styles.loadingOverlay, { backgroundColor: themes['color-appStart-loadingOverlay'] }]}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            )}
            <LottieView
                ref={animationRef}
                source={require('../assets/animation-2025start.json')}
                autoPlay
                loop={false}
                speed={1.2}
                // onAnimationFinish={handleAnimationFinish}
                onLayout={() => setIsLoading(false)}
                resizeMode="cover"
                style={styles.animation}
            />

            {/* 跳过按钮 - 新版 */}
            <TouchableOpacity
                onPress={handleSkip}
                style={[styles.skipButton, { backgroundColor: themes['color-appStart-buttonBg'], borderColor: themes['color-appStart-buttonBorder'] }]}
                activeOpacity={0.7}
            >
                <View style={styles.skipButtonContent}>
                    <Text v-if={countdown !== 0} style={[styles.countdownText, { color: themes['color-appStart-text'] }]}>{countdown}s</Text>
                    <Text style={[styles.skipText, { color: themes['color-appStart-text'] }]}>跳过</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    animation: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.7,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        position: 'absolute',
        top: 30,
        right: 20,
        borderRadius: 20, // 圆角效果
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    skipButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countdownText: {
        fontSize: 14,
        marginRight: 8,
        opacity: 0.8,
    },
    skipText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default AppStart;
