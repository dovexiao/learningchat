import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {NavigationProps} from "../types/navigationType.ts";


export const WelcomeScreen: React.FC<NavigationProps> =  ({ navigation, route }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to ChatHub</Text>
                <Text style={styles.subtitle}>与朋友联系，实时聊天，高效管理资源</Text>
                <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.getStartedButtonText}>开始</Text>
                </TouchableOpacity>
                <View style={styles.signInContainer}>
                    <Text style={styles.alreadyAccountText}>已有账户？ </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signInText}>登入</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.footerText}>© 2025 ChatHub. All rights reserved.</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#212529',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    getStartedButton: {
        backgroundColor: '#212529',
        paddingVertical: 15,
        paddingHorizontal: 80,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    getStartedButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    signInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alreadyAccountText: {
        fontSize: 14,
        color: '#6C757D',
    },
    signInText: {
        fontSize: 14,
        color: '#007BFF',
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        color: '#6C757D',
        fontSize: 12,
        paddingBottom: 20,
    },
});
