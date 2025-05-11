import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
    Avatar,
    Text,
    TopNavigation,
    TopNavigationAction,
    Icon,
} from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import {useGlobal} from '../../hooks/GlobalContext.tsx';

interface TopNavigationAvatarProps {
    navigation: any;
    renderItemAccessory: () => React.ReactElement;
}

const UserAvatar = (): React.ReactElement => (
    <Avatar
        style={styles.avatar}
        source={require('../../assets/icon.png')}
    />
);

const SunIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="sun-outline"
    />
);

const MoonIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="moon-outline"
    />
);

const TopNavigationAvatar: React.FC<TopNavigationAvatarProps> = ({ navigation, renderItemAccessory }) => {
    // const { theme, toggleTheme } = React.useContext(ThemeContext);
    const { nickname } = useGlobal();

    // const [themeIcon, setThemeIcon] = React.useState(theme === 'light' ? 'sun' : 'moon');
    //
    // const onThemeChange = (): void => {
    //     const newThemeIcon = theme === 'light' ? 'moon' : 'sun';
    //     setThemeIcon(newThemeIcon);
    //     toggleTheme();
    // };

    const handleGoPersonCenter = () => {
        navigation.navigate('PersonCenter');
    };

    const renderAvatar = () : React.ReactElement => (
        <View style={styles.titleContainer}>
            <TopNavigationAction icon={UserAvatar} onPress={handleGoPersonCenter} />
            <View style={styles.info}>
                <Text category="h6">{nickname}</Text>
                <Text appearance="hint" category="c1" status="success">强网络</Text>
            </View>
        </View>
    );

    // const renderToggleTheme = (): React.ReactElement => (
    //     <Button
    //         status="primary"
    //         accessoryLeft={themeIcon === 'sun' ? SunIcon : MoonIcon}
    //         appearance="ghost"
    //         onPress={onThemeChange}
    //     />
    // );

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
        marginHorizontal: 5,
    },
    info: {
        flexDirection: 'column',
    },
    userNickname: {
        fontWeight: 'bold',
    },
});

export default TopNavigationAvatar;
