import React, {useState} from 'react';
import {BottomTabBar, BottomTabData} from './BottomNavigation';
import {NavigationProps} from '../types/navigationType.tsx';
import {StyleSheet, View} from 'react-native';
import { Text } from '@ui-kitten/components';

const AppMain: React.FC = () => {
    const [activeBottomTabIndex, setActiveBottomTabIndex] = useState<number>(0);

    const handleBottomTabClick = (bottomTabId: number) => {
        setActiveBottomTabIndex(bottomTabId);
    };

    const ComponentToRender = BottomTabData[activeBottomTabIndex].component;

    return (
        <>
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
