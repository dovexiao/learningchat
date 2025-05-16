import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {WelcomeScreen} from "./WelcomeScreen.tsx";
import {FriendsListScreen} from "./FriendsListScreen.tsx";
import {LoginScreen} from "./LoginScreen.tsx";
import {RegisterScreen} from "./RegisterScreen.tsx";
import {ResourcesScreen} from "./ResourcesScreen.tsx";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
        <Screen name="Welcome" component={WelcomeScreen} />
        <Screen name="FriendsList" component={FriendsListScreen} />
        <Screen name="Resources" component={ResourcesScreen} />
        <Screen name="Login" component={LoginScreen} />
        <Screen name="Register" component={RegisterScreen} />
    </Navigator>
);

export const AppStackNavigator = () => (
    <NavigationContainer>
        <HomeNavigator/>
    </NavigationContainer>
);
