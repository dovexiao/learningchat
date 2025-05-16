import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {NavigationProps} from "../types/navigationType.ts";

export const LoginScreen: React.FC<NavigationProps> = ({ navigation, route }) => {
    const handleLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'FriendsList' }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>登录</Text>
            <Text style={styles.subtitle}>Enter your credentials to access your account</Text>

            <Text style={styles.label}>邮箱</Text>
            <TextInput
                style={styles.input}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>密码</Text>
            <TextInput
                style={styles.input}
                placeholder="请输入您的密码"
                secureTextEntry
            />

           <View>
               <TouchableOpacity style={styles.button} onPress={handleLogin}>
                   <Text style={styles.buttonText}>登录</Text>
               </TouchableOpacity>
           </View>

            <View style={styles.footerTextContainer}>
                <Text style={styles.footerText}>没有账户? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>注册</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6C757D',
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#DEE2E6',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
        color: '#212529',
    },
    button: {
        backgroundColor: '#212529',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#6C757D',
    },
    linkText: {
        fontSize: 14,
        color: '#007BFF',
        fontWeight: '600',
    },
});
