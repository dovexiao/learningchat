import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppStart from './AppStart';
import AppMain from './AppMain';
import AppAuthToken from './AppAuthToekn';
import PersonCenter from './PersonCenter';

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator initialRouteName="AppStart" screenOptions={{headerShown: false}}>
        <Screen name="AppStart" component={AppStart} />
        <Screen name="AppMain" component={AppMain} />
        <Screen name="AppAuthToken" component={AppAuthToken} />
        <Screen name="PersonCenter" component={PersonCenter} />
    </Navigator>
);

export const AppStackNavigator = () => (
    <NavigationContainer>
        <HomeNavigator/>
    </NavigationContainer>
);
