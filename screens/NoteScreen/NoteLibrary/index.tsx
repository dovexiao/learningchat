import React from 'react';
import {Alert, Pressable, SafeAreaView} from 'react-native';
import {Divider, Layout, Text, TopNavigationAction} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import {NavigationProps} from '../../../types/navigationType.ts';
import BasicList from '../../../component/List/BasicList.tsx';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import * as CommonIcon from '../../../component/Icon';

const NoteLibrary: React.FC<NavigationProps> = ({ navigation, route}) => {
    const noteLibrary = route.params.item;

    const onNoteClick = (item: any) => {
        navigation.navigate('Note', { item });
    };

    const accessoryLeft = (): IconElement => (
        <TopNavigationAction
            icon={CommonIcon.FileTextIcon}
        />
    );

    const accessoryRight = (item: any): React.ReactElement => (
        <TopNavigationAction
            icon={CommonIcon.SettingsIcon}
            onPress={() => {Alert.alert('更多', item);}}
        />
    );

    const renderItemAccessory = (): React.ReactElement => (
        <></>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe
                title={noteLibrary.title}
                navigation={navigation}
                renderItemAccessory={renderItemAccessory}
            />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <Pressable onPress={() => onNoteClick({})}>
                    <Text>笔记123</Text>
                </Pressable>
                {/*<BasicList*/}
                {/*    data={data}*/}
                {/*    accessoryLeft={accessoryLeft}*/}
                {/*    accessoryRight={accessoryRight}*/}
                {/*    onListItemClick={onNoteLibraryClick}*/}
                {/*/>*/}
            </Layout>
        </SafeAreaView>
    );
};

export default NoteLibrary;
