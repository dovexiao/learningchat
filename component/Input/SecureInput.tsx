import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { Icon, IconElement, Input, Text } from '@ui-kitten/components';

type InputProps = {
    value: string;
    setValue: (value: string) => void;
};

const AlertIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="alert-circle-outline"
        fill={props.color}
    />
);

const SecureInput = ({ value, setValue }: InputProps): React.ReactElement => {
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const toggleSecureEntry = (): void => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = (props: any): React.ReactElement => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon
                {...props}
                name={secureTextEntry ? 'eye-off' : 'eye'}
                width={35}
                height={35}
            />
        </TouchableWithoutFeedback>
    );

    const renderCaption = (): React.ReactElement => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>
                    Should contain at least 8 words
                </Text>
            </View>
        );
    };

    const renderLabel = (): React.ReactElement => {
        return (
            <Text style={styles.label}>
                Password
            </Text>
        );
    };

    return (
        <Input
            style={styles.input}
            value={value}
            label={renderLabel}
            placeholder="请输入..."
            caption={renderCaption}
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            onChangeText={nextValue => setValue(nextValue)}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        marginVertical: 20,
    },
    captionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
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
});

export default SecureInput;
