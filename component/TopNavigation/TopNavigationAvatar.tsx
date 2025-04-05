import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

interface TopNavigationAvatarProps {
    title: string;
    navigation: any;
    renderItemAccessory: () => React.ReactElement;
}

const UserAvatar = (props: any): React.ReactElement => (
    <Avatar
        style={styles.avatar}
        {...props}
        source={require('../../assets/icon.png')}
    />
);

const TopNavigationAvatar: React.FC<TopNavigationAvatarProps> = ({ navigation, renderItemAccessory }) => {
    const handleGoPersonCenter = () => {
        navigation.navigate('PersonCenter');
    };

    const renderAvatar = (props: any) : React.ReactElement => (
        <View style={styles.titleContainer}>
            <TopNavigationAction icon={UserAvatar} onPress={handleGoPersonCenter} />
            <View style={styles.info}>
                <Text {...props} style={styles.userNickname}>用户123</Text>
                <Text {...props}>强网络</Text>
            </View>
        </View>
    )

    return (
        <TopNavigation
            title={renderAvatar}
            accessoryRight={renderItemAccessory}
        />
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginHorizontal: 16,
    },
    info: {
        flexDirection: 'column',
    },
    userNickname: {
        fontWeight: 'bold',
        lineHeight: 16,
    },
});

export default TopNavigationAvatar;
