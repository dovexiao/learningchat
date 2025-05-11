import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Spinner, useTheme} from '@ui-kitten/components';
import {NavigationProps} from '../../types/navigationType.ts';
import {useAuth} from '../../hooks/AuthContext.tsx';

const AppAuthLoading: React.FC<NavigationProps> = ({ navigation }) => {
    const themes = useTheme();
    const { isTokenRefreshed } = useAuth();

    React.useEffect(() => {
        if (isTokenRefreshed) {
            navigation.replace('AppMain');
        } else if (typeof isTokenRefreshed === 'boolean') {
            navigation.replace('AppLogin');
        }
    }, [isTokenRefreshed]);

    return (
        <View style={[styles.loadingOverlay, { backgroundColor: themes['background-basic-color-1'] }]}>
            <Spinner />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppAuthLoading;
