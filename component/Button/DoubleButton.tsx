import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, useTheme} from '@ui-kitten/components';

type DoubleButtonProps = {
    leftLabel: string;
    rightLabel: string;
    handleLeft: () => void;
    handleRight: () => void;
};

const DoubleButton = ({ leftLabel, rightLabel, handleLeft, handleRight }: DoubleButtonProps) => {
    const themes = useTheme();

    return (
        <View style={styles.container}>
            <Button
                style={[styles.button, styles.leftButton]}
                onPress={handleLeft}
            >
                {leftLabel}
            </Button>
            <Button
                style={[styles.button, styles.rightButton, { backgroundColor: themes['background-basic-color-1'] }]}
                appearance="outline"
                onPress={handleRight}
            >
                {rightLabel}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 20,
    },
    button: {
        width: '50%',
    },
    leftButton: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    rightButton: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
});

export default DoubleButton;
