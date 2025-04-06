import React from 'react';
import {BottomNavigation, BottomNavigationTab, Icon, IconElement} from '@ui-kitten/components';
import MessageList from '../ChatSpace';
import SharedNote from '../SharedNote';
import SharedQuestion from '../SharedQuestion';
import LearnForum from '../LearnForum';

interface TabItem<T = {}> {
    key: string;
    label: string;
    component: React.ComponentType<T>;
    icon: (props: any) => IconElement;
}

interface BottomTabBarProp {
    onBottomTabClick: (index: number) => void;
    index: number;
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
    { key: 'CHAT_SPACE', label: '消息', component: MessageList as React.ComponentType<{}>, icon: chatSpaceIcon },
    { key: 'SHARED_NOTE', label: '笔记', component: SharedNote as React.ComponentType<{}>, icon: sharedNoteIcon },
    { key: 'SHARED_QUESTION', label: '题库', component: SharedQuestion as React.ComponentType<{}>, icon: sharedQuestionIcon },
    { key: 'LEARN_FORUM', label: '论坛', component: LearnForum as React.ComponentType<{}>, icon: learnForumIcon },
];

export const BottomTabBar: React.FC<BottomTabBarProp> = ({ onBottomTabClick, index }: any) => {
    return (
        <BottomNavigation
            selectedIndex={index}
            onSelect={(index: number) => {
                onBottomTabClick(index);
            }}
        >
            {BottomTabData.map((item) => (
                <BottomNavigationTab key={item.key} title={item.label} icon={item.icon} />
            ))}
        </BottomNavigation>
    );
};

