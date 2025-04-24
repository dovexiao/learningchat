import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppStart from './AppStart.tsx';
import AppMain from './AppMain.tsx';
import AppAuthLoading from './AuthScreen/AppAuthLoading.tsx';
import AppLogin from './AuthScreen/AppLogin.tsx';
import AppRegister from './AuthScreen/AppRegister.tsx';
import ChatSpace from './ChatScreen/ChatSpace';
import NoteLibrary from './NoteScreen/NoteLibrary';
import Note from './NoteScreen/Note';
import QuestionLibrary from './QuestionsScreen/QuestionLibrary';
import TestLibrary from './QuestionsScreen/TestLibrary';
import Post from './ForumScreen/Post';
import Comment from './ForumScreen/Comment';
import PostTI from './ForumScreen/PostTI';
import PostTags from './ForumScreen/PostTags';

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
        <Screen name="QuestionLibrary" component={QuestionLibrary} initialParams={{item: null}} />
        <Screen name="TestLibrary" component={TestLibrary} initialParams={{item: null}} />
        <Screen name="Post" component={Post} initialParams={{item: null}} />
        <Screen name="Comment" component={Comment} initialParams={{comment: null}} />
        <Screen name="PostTI" component={PostTI} />
        <Screen name="PostTags" component={PostTags} initialParams={{text: null, images: null}} />
    </Navigator>
);

export const AppStackNavigator = () => (
    <NavigationContainer>
        <HomeNavigator/>
    </NavigationContainer>
);
