import React from 'react';
import {Icon, TopNavigation, TopNavigationAction, Text, useTheme} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';

interface TopNavigationOpeProps {
    title: string;
    navigation: any;
    renderItemAccessory: () => React.ReactElement;
}

const BackIcon = (props: any): IconElement => (
    <Icon
        {...props.props}
        name="arrow-back"
        fill={props.tintColor}
    />
);

const TopNavigationOpe: React.FC<TopNavigationOpeProps> = ({ navigation, title, renderItemAccessory }) => {
    const themes = useTheme();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const renderBackAction = (): React.ReactElement => (
        <TopNavigationAction
            icon={(props) => BackIcon({props, tintColor: themes['color-primary-500']})}
            onPress={handleGoBack}
        />
    );

    const renderTitleAction = (): React.ReactElement => (
        <View style={{ width: '65%', alignItems: 'center', marginVertical: 10 }}>
            <Text
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode={'tail'}
            >{title}</Text>
        </View>
    );

    return (
        <TopNavigation
            title={renderTitleAction}
            alignment="center"
            accessoryLeft={renderBackAction}
            accessoryRight={renderItemAccessory}
        />
    );
};

const styles = StyleSheet.create({
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TopNavigationOpe;
