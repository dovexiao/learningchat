import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {
    BottomNavigation,
    BottomNavigationTab,
    Icon,
    IconElement,
    TopNavigationAction,
} from '@ui-kitten/components';
import {NavigationProps} from '../types/navigationType.ts';
import TopNavigationAvatar from '../component/TopNavigation/TopNavigationAvatar.tsx';
import {CenterCardDisplay} from '../component/CenterCardDisplay';
import * as CommonIcon from '../component/Icon';
import {View} from 'react-native';
import {useGlobal} from '../hooks/GlobalContext.tsx';

interface TabItem {
    key: string;
    label: string;
    icon: (props: any) => IconElement;
}

const chatSpaceIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="message-square-outline"
    />
);

const sharedNoteIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="file-text-outline"
    />
);

const sharedQuestionIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="book-outline"
    />
);

const learnForumIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="people-outline"
    />
);

export const BottomTabData: TabItem[] = [
    { key: 'CHAT_SPACE', label: '消息', icon: chatSpaceIcon },
    { key: 'SHARED_NOTE', label: '笔记', icon: sharedNoteIcon },
    { key: 'SHARED_QUESTION', label: '题库', icon: sharedQuestionIcon },
    { key: 'LEARN_FORUM', label: '论坛', icon: learnForumIcon },
];

const chatMenu = [{
    icon: CommonIcon.AddIcon,
    title: '创建群聊',
    onPress: () => {},
}, {
    icon: CommonIcon.MessageIcon,
    title: '消息通知',
    onPress: (navigation: any) => {
        navigation.navigate('SystemNotification');
    },
}, {
    icon: CommonIcon.PersonAddIcon,
    title: '加友加群',
    onPress: (navigation: any) => {
        navigation.navigate('ChatSpaceAdd');
    },
}];

const noteMenu = [{
    icon: CommonIcon.SearchIcon,
    title: '搜笔记库',
    onPress: () => {},
}, {
    icon: CommonIcon.FolderAddIcon,
    title: '建笔记库',
    onPress: () => {},
}];

const questionsMenu: any[] = [];

const forumMenu = [{
    icon: CommonIcon.SearchIcon,
    title: '圈子帖子',
    onPress: () => {},
}, {
    icon: CommonIcon.MessageIcon,
    title: '消息通知',
    onPress: () => {},
}, {
    icon: CommonIcon.AddIcon,
    title: '发布帖子',
    onPress: (navigation: any) => {
        navigation.navigate('PostTI');
    },
}];

const AppMain: React.FC<NavigationProps> = ({ navigation }) => {
    const topNavigationRef = React.useRef<any>(null);
    const centerCardDisplayRef = useRef<any>(null);
    const bottomTabNavigationRef = useRef<any>(null);
    const { bottomModalRef } = useGlobal();

    const onBottomTabClick = React.useCallback((index: number) => {
        topNavigationRef.current?.setSelectedIndex(index);
        centerCardDisplayRef.current?.animateToPosition(index);
        bottomModalRef.current?.hidden();
    }, [bottomModalRef]);

    const onDisplaySlide = React.useCallback((index: number) => {
        topNavigationRef.current?.setSelectedIndex(index);
        bottomTabNavigationRef.current?.setSelectedIndex(index);
        bottomModalRef.current?.hidden();
    }, [bottomModalRef]);

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <TopNavigation
                ref={topNavigationRef}
                navigation={navigation}
            />
            <CenterCardDisplay
                ref={centerCardDisplayRef}
                navigation={navigation}
                onDisplaySlide={onDisplaySlide}
            />
            <BottomTabNavigation
                ref={bottomTabNavigationRef}
                onBottomTabClick={onBottomTabClick}
            />
        </View>
    );
};

type TopNavigationHandle = {
    setSelectedIndex: (index: number) => void;
}

type TopNavigationProps = {
    navigation: any;
}

const TopNavigation = forwardRef<TopNavigationHandle, TopNavigationProps>(({ navigation }, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    useImperativeHandle(ref, () => ({
        setSelectedIndex: (index: number) => setSelectedIndex(index),
    }));

    const getMenuData = (): any[] => {
        switch (selectedIndex) {
            case 0:
                return chatMenu;
            case 1:
                return noteMenu;
            case 2:
                return questionsMenu;
            case 3:
                return forumMenu;
            default:
                return [];
        }
    };

    const renderOpeAccessory = (): React.ReactElement => (
        <>
            {getMenuData().map((item: any) => (
                <TopNavigationAction
                    key={item.title}
                    icon={item.icon}
                    onPress={() => {
                        item.onPress(navigation);
                    }}
                />
            ))}
            {/*<TopNavigationAction*/}
            {/*    icon={CommonIcon.SettingsIcon}*/}
            {/*    onPress={() => {*/}
            {/*        menuRef.current?.show();*/}
            {/*    }}*/}
            {/*/>*/}
        </>
    );

    return (
        <TopNavigationAvatar
            navigation={navigation}
            renderItemAccessory={renderOpeAccessory}
        />
    );
});

type BottomNavigationHandle = {
    setSelectedIndex: (index: number) => void;
}

type BottomNavigationProps = {
    onBottomTabClick: (index: number) => void;
}

const BottomTabNavigation = forwardRef<BottomNavigationHandle, BottomNavigationProps>(({onBottomTabClick}, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    useImperativeHandle(ref, () => ({
        setSelectedIndex: (index: number) => setSelectedIndex(index),
    }));

    return (
        <BottomNavigation
            selectedIndex={selectedIndex}
            onSelect={(index: number) => {
                onBottomTabClick(index);
                setSelectedIndex(index);
            }}
        >
            {BottomTabData.map((item) => (
                <BottomNavigationTab key={item.key} title={item.label} icon={item.icon} />
            ))}
        </BottomNavigation>
    );
});

export default AppMain;
