import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {Animated, Text, View, StyleSheet, TouchableOpacity, Pressable, ScrollView} from 'react-native';
import {Icon} from "@ui-kitten/components";

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// 假设你已定义 RootStackParamList 包含 'FriendList'
type RootStackParamList = {
    FriendsList: undefined;
    Resources: undefined;
    // 其他页面...
};

type NavigationType = StackNavigationProp<RootStackParamList>;

export type MessageHandle = {
    show: (type: string, content: string) => void;
};

const SlideOutView = forwardRef<MessageHandle>((_, ref) => {
    const animValue = useRef(new Animated.Value(-300)).current;
    const [visible, setVisible] = useState(false);
    const [navigation, setNavigation] = useState<NavigationType | null>(null);
    const [type, setType] = useState('');

    const showAnimation = Animated.timing(animValue, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
    });

    const hideAnimation = Animated.timing(animValue, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
    });

    useImperativeHandle(ref, () => ({
        show: (type, navigation: any) => {
            setType(type);
            setNavigation(navigation);
            showAnimation.start(() => {
                setVisible(true);
            });
        },
    }));

    return (
        <>
            {visible && <Pressable
                style={styles.overlay}
                onPress={() => hideAnimation.start(() => {
                    setVisible(false)
                })}
            />}
            <Animated.View
                style={[
                    styles.container,
                    { transform: [{ translateX: animValue }] },
                ]}
            >
                <View style={styles.bodyContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>ChatHub</Text>
                        <TouchableOpacity>
                            {/*<X color="#333333" size={28} />*/}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.navItem, type === 'Friends' && styles.highlightedItem]}
                        onPress={() => {
                            if (navigation) {
                                navigation.navigate('FriendsList');
                                hideAnimation.start(() => {
                                    setVisible(false)
                                })
                            }
                        }}
                    >
                        {/*<Users color="#333333" size={24} style={styles.navIcon} />*/}
                        <Icon name={'people-outline'} style={{ width: 25, height: 25 }}></Icon>
                        <Text style={styles.navText}>好友列表</Text>
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={styles.navItem}>*/}
                    {/*    <MessageSquare color="#333333" size={24} style={styles.navIcon} />*/}
                    {/*    <Text style={styles.navText}>Chat Rooms</Text>*/}
                    {/*</TouchableOpacity>*/}

                    <TouchableOpacity
                        style={[styles.navItem, type === 'Resources' && styles.highlightedItem]}
                        onPress={() => {
                            if (navigation) {
                                navigation.navigate('Resources');
                                hideAnimation.start(() => {
                                    setVisible(false)
                                })
                            }
                        }}
                    >
                        {/*<Database color="#333333" size={24} style={styles.navIcon} />*/}
                        <Icon name={'grid-outline'} style={{ width: 25, height: 25 }}></Icon>
                        <Text style={styles.navText}>资源管理</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.logoutButton}>
                            <Icon name={'log-out-outline'} style={{ width: 25, height: 25 }}></Icon>
                            <Text style={styles.logoutText}>退出</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: -300,
        bottom: 0,
        width: '50%',
        zIndex: 999,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 99,
    },
    bodyContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10, // 为底部按钮留出空间
        backgroundColor: '#F8F9FA', // 侧边栏的背景色
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    highlightedItem: {
        backgroundColor: '#E9ECEF',
    },
    navIcon: {
        marginRight: 18,
    },
    navText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        color: '#333333',
        fontWeight: '500',
    },
    footer: {
        marginTop: 'auto', // 将登出按钮推到底部
        paddingTop: 20, // 与上方内容的间距
        marginBottom: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CED4DA',
        backgroundColor: '#FFFFFF', // 登出按钮背景色
    },
    logoutText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        color: '#333333',
        fontWeight: '500',
    },
});

export default SlideOutView;
