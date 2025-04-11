import React from 'react';
import {BottomNavigation, BottomNavigationTab, Icon, IconElement} from '@ui-kitten/components';
import ChatMain from '../../screens/ChatScreen';
import NoteMain from '../../screens/NoteScreen';
import QuestionMain from '../../screens/QuestionsScreen';
import ForumMain from '../../screens/ForumScreen';
import {NavigationProps} from '../../types/navigationType.tsx';

interface TabItem {
    key: string;
    label: string;
    component: React.ComponentType<NavigationProps>;
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
    { key: 'CHAT_SPACE', label: '消息', component: ChatMain as React.ComponentType<NavigationProps>, icon: chatSpaceIcon },
    { key: 'SHARED_NOTE', label: '笔记', component: NoteMain as React.ComponentType<NavigationProps>, icon: sharedNoteIcon },
    { key: 'SHARED_QUESTION', label: '题库', component: QuestionMain as React.ComponentType<NavigationProps>, icon: sharedQuestionIcon },
    { key: 'LEARN_FORUM', label: '论坛', component: ForumMain as React.ComponentType<NavigationProps>, icon: learnForumIcon },
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

