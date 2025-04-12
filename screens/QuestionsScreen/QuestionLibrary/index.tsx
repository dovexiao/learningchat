import React from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {Divider, Layout, TopNavigationAction} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import {NavigationProps} from '../../../types/navigationType.tsx';
import {AccessList} from '../../../component/List';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import * as CommonIcon from '../../../component/Icon';

const data = new Array(10).fill({
    title: '图形学之史',
    subTitle: '计算机 2025-04-15',
    other: '',
});

const QuestionLibrary: React.FC<NavigationProps> = ({ navigation, route}) => {
    const noteLibrary = route.params.item;

    const onNoteLibraryClick = (item: any) => {
        navigation.navigate('Question', { item });
    };

    const accessoryLeft = (): IconElement => (
        <TopNavigationAction
            icon={CommonIcon.QuestionIcon}
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

export default QuestionLibrary;
