import React, {useState} from 'react';
import {
    BottomNavigation,
    BottomNavigationTab,
    Divider,
    Icon,
    IconElement,
    TopNavigationAction,
} from '@ui-kitten/components';
import {NavigationProps} from '../types/navigationType.tsx';
import TopNavigationAvatar from '../component/TopNavigation/TopNavigationAvatar.tsx';
import {CenterCardDisplay} from '../component/CenterCardDisplay';
import OverflowMenu from '../component/Menu/OverflowMenu.tsx';
import * as CommonIcon from '../component/Icon';

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
    onPress: () => {},
}, {
    icon: CommonIcon.PersonAddIcon,
    title: '加友加群',
    onPress: () => {},
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
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const menuRef = React.useRef<any>(null);

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

    const onBottomTabClick = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <>
            <TopNavigationAvatar
                navigation={navigation}
                renderItemAccessory={renderOpeAccessory}
            />
            <Divider />
            <CenterCardDisplay
                navigation={navigation}
                selectedIndex={selectedIndex}
                onBottomTabClick={onBottomTabClick}
            />
            <Divider />
            <BottomNavigation
                selectedIndex={selectedIndex}
                onSelect={(index: number) => {
                    // onBottomTabClick(index);
                    setSelectedIndex(index);
                }}
            >
                {BottomTabData.map((item) => (
                    <BottomNavigationTab key={item.key} title={item.label} icon={item.icon} />
                ))}
            </BottomNavigation>
            <OverflowMenu ref={menuRef} menuData={getMenuData()} position={{x: 5, y: -50}} />
        </>
    );
};

export default AppMain;
