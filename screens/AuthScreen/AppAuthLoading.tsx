import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Spinner, useTheme} from '@ui-kitten/components';
import {useAuth} from '../../hooks/AuthContext.tsx';
import {NavigationProps} from '../../types/navigationType.tsx';

const AppAuthLoading: React.FC<NavigationProps> = ({ navigation }) => {
    const themes = useTheme();
    const { isTokenExpired } = useAuth();
    const navigationRef = useRef(navigation);

    React.useEffect(() => {
        if (isTokenExpired) {
            navigationRef.current.replace('AppMain');
        } else if (typeof isTokenExpired === 'boolean') {
            navigationRef.current.replace('AppLogin');
        }
    }, [isTokenExpired]);

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
