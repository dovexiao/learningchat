import React, {useState} from 'react';
import {BottomTabBar, BottomTabData} from "./BottomNavigation";
import TopNavigationAvatar from "./TopNavigation/TopNavigationAvatar.tsx";
import {NavigationProps} from "../types/navigationType.tsx";
import ChatSpace from "./ChatSpace";
import {StyleSheet, View} from "react-native";
import { Text } from '@ui-kitten/components';

const AppMain: React.FC<NavigationProps> = ({ navigation }) => {
    const [activeBottomTabIndex, setActiveBottomTabIndex] = useState<number>(0);

    const handleBottomTabClick = (bottomTabId: number) => {
        setActiveBottomTabIndex(bottomTabId);
    };

    const renderItemAccessory = (): React.ReactElement => {
        return (
            <></>
        );
    };

    const ComponentToRender = BottomTabData[activeBottomTabIndex].component;

    return (
        <>
            <TopNavigationAvatar
                navigation={navigation}
                // renderItemAccessory={renderItemAccessory}
            />
            <View style={styles.container}>
                {ComponentToRender ? (
                    React.createElement(ComponentToRender)
                ) : (
                    <Text>Not find</Text>
                )}
            </View>
            <BottomTabBar index={activeBottomTabIndex} onBottomTabClick={handleBottomTabClick}/>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppMain;
