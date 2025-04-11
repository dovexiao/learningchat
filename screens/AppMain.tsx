import React, {useState} from 'react';
import {BottomTabBar, BottomTabData} from '../component/BottomNavigation';
import {StyleSheet, View} from 'react-native';
import { Text } from '@ui-kitten/components';
import {NavigationProps} from '../types/navigationType.tsx';

const AppMain: React.FC<NavigationProps> = ({ navigation }) => {
    const [activeBottomTabIndex, setActiveBottomTabIndex] = useState<number>(0);

    const handleBottomTabClick = (bottomTabId: number) => {
        setActiveBottomTabIndex(bottomTabId);
    };

    const ComponentToRender = BottomTabData[activeBottomTabIndex].component;

    return (
        <>
            <View style={styles.container}>
                {ComponentToRender ? (
                    React.createElement(ComponentToRender, { navigation })
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
