import React from 'react';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';

interface TopNavigationOpeProps {
    title: string;
    navigation: any;
    renderItemAccessory: () => React.ReactElement;
}

const BackIcon = (props: any): IconElement => (
    <Icon {...props} name="arrow-back" />
);

const TopNavigationOpe: React.FC<TopNavigationOpeProps> = ({ navigation, title, renderItemAccessory }) => {
    const handleGoBack = () => {
        navigation.goBack();
    };

    const renderBackAction = (): React.ReactElement => (
        <TopNavigationAction icon={BackIcon} onPress={handleGoBack} />
    );

    return (
        <TopNavigation
            title={title}
            alignment="center"
            accessoryLeft={renderBackAction}
            accessoryRight={renderItemAccessory}
        />
    );
};

export default TopNavigationOpe;
