import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStart } from './AppStart';
import { AppMain } from './AppMain';

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator initialRouteName="AppStart" screenOptions={{headerShown: false}}>
        <Screen name="AppStart" component={AppStart} />
        <Screen name="AppMain" component={AppMain} />
    </Navigator>
);

export const AppStackNavigator = () => (
    <NavigationContainer>
        <HomeNavigator/>
    </NavigationContainer>
);
