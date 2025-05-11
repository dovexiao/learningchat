import {Divider, type IconElement, Layout, Tab, TabBar, TopNavigationAction} from '@ui-kitten/components';
import React from 'react';
import {Alert, SafeAreaView} from 'react-native';
import TopNavigationAvatar from '../../component/TopNavigation/TopNavigationAvatar.tsx';
import {NavigationProps} from '../../types/navigationType.ts';
import * as CommonIcon from '../../component/Icon';
import {BasicList} from '../../component/List/BasicList.tsx';

const data1 = new Array(10).fill({
    title: '题目集: 12345',
    subTitle: '计算机 2025-04-15',
    other: '',
});

const data2 = new Array(10).fill({
    title: '测试集: 12345',
    subTitle: '计算机 2025-04-15',
    other: '',
});

const QuestionsMain: React.FC<NavigationProps> = ({ navigation }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

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
            <TabBar
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}
            >
                <Tab title="题目集" style={{height: 40}}/>
                <Tab title="测试集" />
            </TabBar>
            <Layout style={{ flex: 1, alignItems: 'center'}}>
                {
                    selectedIndex === 0 ?
                        <QuestionLibraryList navigation={navigation} /> :
                        selectedIndex === 1 ?
                            <TestLibraryList navigation={navigation} /> :
                            <></>
                }
            </Layout>
        </SafeAreaView>
    );
};

const QuestionLibraryList = ({ navigation }: NavigationProps): React.ReactElement => {
    const onNoteLibraryClick = (item: any) => {
        navigation.navigate('QuestionLibrary', { item });
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

    return (
        <BasicList
            data={data1}
            accessoryLeft={accessoryLeft}
            accessoryRight={accessoryRight}
            onListItemClick={onNoteLibraryClick}
        />
    );
};

const TestLibraryList = ({ navigation }: NavigationProps): React.ReactElement => {
    const onNoteLibraryClick = (item: any) => {
        navigation.navigate('TestLibrary', { item });
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

    return (
        <BasicList
            data={data2}
            accessoryLeft={accessoryLeft}
            accessoryRight={accessoryRight}
            onListItemClick={onNoteLibraryClick}
        />
    );
};

export default QuestionsMain;
