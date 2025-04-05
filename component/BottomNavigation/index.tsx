import React from "react";
import {BottomNavigation, BottomNavigationTab, Icon, IconElement} from "@ui-kitten/components";
import ChatSpace from "../ChatSpace";
import SharedNote from "../SharedNote";
import SharedQuestion from "../SharedQuestion";

interface TabItem {
    key: string;
    label: string;
    component: React.ComponentType;
    icon: (props: any) => IconElement;
}

interface BottomTabBarProp {
    onBottomTabClick: (index: number) => void;
    index: number;
}

const chatSpaceIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name='message-square-outline'
    />
);

const sharedNoteIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name='file-text-outline'
    />
);

const sharedQuestionIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name='book-outline'
    />
);

export const BottomTabData: TabItem[] = [
    { key: 'CHAT_SPACE', label: '消息', component: ChatSpace, icon: chatSpaceIcon },
    { key: 'SHARED_NOTE', label: '笔记', component: SharedNote, icon: sharedNoteIcon },
    { key: 'SHARED_QUESTION', label: '题库', component: SharedQuestion, icon: sharedQuestionIcon }
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

