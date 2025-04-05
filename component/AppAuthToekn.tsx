import { View } from 'react-native';
import React, { useEffect } from 'react';
import {NavigationProps} from '../types/navigationType.tsx';

const AppAuthToken: React.FC<NavigationProps>  = ({ navigation}) => {

    const checkAuthToken = async () => {
        try {
            console.log('Token认证通过');
            return true;
        } catch (error) {
            console.error('Token认证失败:', error);
            return false;
        }
    };

    useEffect(() => {
        const authenticate = async () => {
            try {
                const isAuthenticated = await checkAuthToken();
                if (isAuthenticated) {
                    navigation.replace('AppMain');
                } else {
                    // navigation.replace('Login');
                }
            } catch (error) {
                console.error('认证过程出错:', error);
                // navigation.replace('ErrorScreen');
            }
        };

        authenticate().catch(error =>
            console.error('认证失败:', error)
        );
    }, [navigation]);

    return (
        <View />
    );
};

export default AppAuthToken;
