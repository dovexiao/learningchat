import React from 'react';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import {Alert, Pressable, SafeAreaView} from 'react-native';
import {NavigationProps} from '../../types/navigationType.ts';
import { Divider, Layout, Text, TopNavigationAction } from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import BasicList from '../../component/List/BasicList.tsx';
import * as CommonIcon from '../../component/Icon';

const NoteMain: React.FC<NavigationProps> = ({ navigation }) => {
    const onNoteLibraryClick = (item: any) => {
        navigation.navigate('NoteLibrary', { item });
    };

    const accessoryLeft = (): IconElement => (
        <TopNavigationAction
            icon={CommonIcon.FolderIcon}
        />
    );

    const accessoryRight = (item: any): React.ReactElement => (
        <TopNavigationAction
            // icon={CommonIcon.BasicOpeIcon}
            onPress={() => {Alert.alert('更多', item);}}
        />
    );

    const renderOpeAccessory = () => (
        <></>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/*<TopNavigationAvatar*/}
            {/*    navigation={navigation}*/}
            {/*    renderItemAccessory={renderOpeAccessory}*/}
            {/*/>*/}
            {/*<Divider />*/}
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <Pressable onPress={() => onNoteLibraryClick({})}>
                    <Text>笔记库123</Text>
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

export default NoteMain;
