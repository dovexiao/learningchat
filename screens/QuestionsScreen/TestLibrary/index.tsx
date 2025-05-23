import React from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {Divider, Layout, TopNavigationAction} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import {NavigationProps} from '../../../types/navigationType.ts';
import {BasicList} from '../../../component/List/BasicList.tsx';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import * as CommonIcon from '../../../component/Icon';

const data = new Array(10).fill({
    title: '图形学之史',
    subTitle: '计算机 2025-04-15',
    other: '',
});

const TestLibrary: React.FC<NavigationProps> = ({ navigation, route}) => {
    const noteLibrary = route.params.item;

    const onNoteLibraryClick = (item: any) => {
        navigation.navigate('Test', { item });
    };

    const accessoryLeft = (): IconElement => (
        <TopNavigationAction
            icon={CommonIcon.FileTextIcon}
        />
    );

    const accessoryRight = (item: any): React.ReactElement => (
        <TopNavigationAction
            icon={CommonIcon.BasicOpeIcon}
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
                <BasicList
                    data={data}
                    accessoryLeft={accessoryLeft}
                    accessoryRight={accessoryRight}
                    onListItemClick={onNoteLibraryClick}
                />
            </Layout>
        </SafeAreaView>
    );
};

export default TestLibrary;
