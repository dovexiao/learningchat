import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppStart from './AppStart';
import AppMain from './AppMain';
import AppAuthToken from './AppAuthToekn';
import PersonCenter from './PersonCenter';
import ChatSpace from './ChatSpace';
import SharedNote from './SharedNote';
import SharedQuestion from "./SharedQuestion";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator initialRouteName="AppStart" screenOptions={{headerShown: false}}>
        <Screen name="AppStart" component={AppStart} />
        <Screen name="AppMain" component={AppMain} />
        <Screen name="AppAuthToken" component={AppAuthToken} />
        <Screen name="PersonCenter" component={PersonCenter} />
        <Screen name="ChatSpace" component={ChatSpace} />
        <Screen name="SharedNote" component={SharedNote} />
        <Screen name="SharedQuestion" component={SharedQuestion} />
    </Navigator>
);

export const AppStackNavigator = () => (
    <NavigationContainer>
        <HomeNavigator/>
    </NavigationContainer>
);
