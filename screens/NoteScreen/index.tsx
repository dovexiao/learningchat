import React from 'react';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import { Alert, SafeAreaView } from 'react-native';
import {NavigationProps} from '../../types/navigationType.tsx';
import { Divider, Layout, TopNavigationAction } from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import { AccessList } from '../../component/List';
import * as CommonIcon from '../../component/Icon';

const data = new Array(10).fill({
    title: '笔记库: 基于图形学的理论设计与开发实践',
    subTitle: '计算机 2025-04-15',
    other: '',
});

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
            icon={CommonIcon.BasicOpeIcon}
            onPress={() => {Alert.alert('更多', item);}}
        />
    );

    const renderOpeAccessory = () => (
        <></>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationAvatar
                navigation={navigation}
                renderItemAccessory={renderOpeAccessory}
            />
            <Divider />
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                <AccessList
                    data={data}
                    accessoryLeft={accessoryLeft}
                    accessoryRight={accessoryRight}
                    onListItemClick={onNoteLibraryClick}
                />
            </Layout>
        </SafeAreaView>
    );
};

export default NoteMain;
