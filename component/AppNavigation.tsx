import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppStart from './AppStart';
import AppMain from './AppMain';
import AppAuthToken from './AppAuthToekn';
import PersonCenter from './PersonCenter';
import SharedNote from './SharedNote';
import SharedQuestion from './SharedQuestion';
import MessageList from './ChatSpace';
import ChatSpace from './ChatSpace/ChatSpace';

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator initialRouteName="AppStart" screenOptions={{headerShown: false}}>
        <Screen name="AppStart" component={AppStart} />
        <Screen name="AppMain" component={AppMain} />
        <Screen name="AppAuthToken" component={AppAuthToken} />
        <Screen name="PersonCenter" component={PersonCenter} />
        <Screen name="MessageList" component={MessageList} />
        <Screen name="ChatSpace" component={ChatSpace} initialParams={{index: 0}} />
        <Screen name="SharedNote" component={SharedNote} />
        <Screen name="SharedQuestion" component={SharedQuestion} />
    </Navigator>
);

export const AppStackNavigator = () => (
    <NavigationContainer>
        <HomeNavigator/>
    </NavigationContainer>
);
