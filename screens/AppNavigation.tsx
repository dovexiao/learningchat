import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppStart from './AppStart.tsx';
import AppMain from './AppMain.tsx';
import ChatSpace from './ChatScreen/ChatSpace';
import NoteLibrary from './NoteScreen/NoteLibrary';
import Note from './NoteScreen/Note';
import AppAuthLoading from './AuthScreen/AppAuthLoading.tsx';
import AppLogin from './AuthScreen/AppLogin.tsx';
import AppRegister from './AuthScreen/AppRegister.tsx';

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator initialRouteName="AppStart" screenOptions={{headerShown: false}}>
        <Screen name="AppStart" component={AppStart} />
        <Screen name="AppMain" component={AppMain} />
        <Screen name="AppLogin" component={AppLogin} />
        <Screen name="AppRegister" component={AppRegister} />
        <Screen name="AppAuthLoading" component={AppAuthLoading} />
        <Screen name="ChatSpace" component={ChatSpace} initialParams={{item: null}} />
        <Screen name="NoteLibrary" component={NoteLibrary} initialParams={{item: null}} />
        <Screen name="Note" component={Note} initialParams={{item: null}} />
    </Navigator>
);

export const AppStackNavigator = () => (
    <NavigationContainer>
        <HomeNavigator/>
    </NavigationContainer>
);
