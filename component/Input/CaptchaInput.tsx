import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Icon, IconElement, Input, Text, useTheme} from '@ui-kitten/components';
import {SvgXml} from 'react-native-svg';

type InputProps = {
    label: string;
    value: string;
    setValue: (value: string) => void;
    captchaSvg: string;
    handleCaptcha: () => void;
    caption: string;
};

const AlertIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="alert-circle-outline"
        fill={props.color}
    />
);

const CaptchaInput = ({ label, value, setValue, captchaSvg, handleCaptcha, caption }: InputProps) => {
    const themes = useTheme();

    const renderCaption = (): React.ReactElement => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>
                    { caption }
                </Text>
            </View>
        );
    };

    const renderLabel = (): React.ReactElement => {
        return (
            <Text style={styles.label}>
                {  label }
            </Text>
        );
    };

    const renderCaptcha = (): React.ReactElement => {
        return captchaSvg ? (
            <View style={{ backgroundColor: themes['background-basic-color-1'] }}>
                <TouchableWithoutFeedback onPress={handleCaptcha}>
                    <SvgXml xml={captchaSvg} width="125" height="35"/>
                </TouchableWithoutFeedback>
            </View>

        ) : (
            <View style={[styles.loadingContainer, { backgroundColor: themes['background-basic-color-1'] }]}>
                <Text>加载中...</Text>
            </View>
        );
    };

    return (
        <Input
            style={styles.input}
            value={value}
            label={renderLabel}
            placeholder="请输入..."
            caption={renderCaption}
            accessoryRight={renderCaptcha}
            onChangeText={nextValue => setValue(nextValue)}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    captionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    captionIcon: {
        width: 10,
        height: 10,
        marginRight: 5,
        color: '#8F9BB3',
    },
    captionText: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'opensans-regular',
        color: '#8F9BB3',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 125,
        height: 35,
    },
});

export default CaptchaInput;
