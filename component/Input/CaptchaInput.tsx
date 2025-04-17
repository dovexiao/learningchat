import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Input, Text} from '@ui-kitten/components';
import {SvgXml} from 'react-native-svg';

type InputProps = {
    value: string;
    setValue: (value: string) => void;
    captchaSvg: string;
    handleCaptcha: () => void;
};

const CaptchaInput = ({ value, setValue, captchaSvg, handleCaptcha }: InputProps) => {
    const renderLabel = (): React.ReactElement => {
        return (
            <Text style={styles.label}>
                Captcha
            </Text>
        );
    };

    const renderCaptcha = (): React.ReactElement => {
        return captchaSvg ? (
            <View>
                <TouchableWithoutFeedback onPress={handleCaptcha}>
                    <SvgXml xml={captchaSvg} height="35"/>
                </TouchableWithoutFeedback>
            </View>

        ) : (
            <Text style={{textAlign: 'center'}}>加载中...</Text>
        );
    };

    return (
        <Input
            style={styles.input}
            value={value}
            label={renderLabel}
            placeholder="请输入..."
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
});

export default CaptchaInput;
