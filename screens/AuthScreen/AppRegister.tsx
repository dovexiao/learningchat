import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationProps} from '../../types/navigationType.tsx';
import {Text, useTheme} from '@ui-kitten/components';
import SecureInput from '../../component/Input/SecureInput.tsx';
import NormalInput from '../../component/Input/Normalnput.tsx';
import DoubleButton from '../../component/Button/DoubleButton.tsx';
import CaptchaInput from '../../component/Input/CaptchaInput.tsx';
import * as api from '../../services/api/AuthApi.ts';
import {errAlert} from '../../component/Alert/err.tsx';

const AppRegister: React.FC<NavigationProps> = ({ navigation }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [captchaKey, setCaptchaKey] = React.useState('');
    const [captchaText, setCaptchaText] = React.useState('');
    const [captchaSvg, setCaptchaSvg] = React.useState('');

    const themes = useTheme();

    const handleLogin = () => {
        navigation.goBack();
    };

    const handleRegister = async () => {
        try {
            await api.register(username, password, captchaKey, captchaText);
            navigation.goBack();
        } catch (error) {
            errAlert(error);
        }
    };

    const getRegisterCaptcha = async () => {
        try {
            const captcha = await api.getCaptcha();
            setCaptchaKey(captcha.key);
            setCaptchaSvg(captcha.image);
        } catch (error) {
            errAlert(error);
        }
    };

    React.useEffect(() => {
        (async () => {
            await getRegisterCaptcha();
        })();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: themes['background-basic-color-1'] }]}>
            <View style={styles.inputContainer}>
                <Text category={'h1'} style={styles.title} >注册</Text>
                <NormalInput label={'手机号码'} value={username} setValue={setUsername} caption={'请输入11位有效数字'} />
                <SecureInput label={'密码'} value={password} setValue={setPassword} caption={'请输入至少8位有效字符'} />
                <CaptchaInput label={'验证码'} value={captchaText} setValue={setCaptchaText} captchaSvg={captchaSvg} handleCaptcha={getRegisterCaptcha} caption={'请输入有效答案'} />
                <DoubleButton leftLabel={'注册'} rightLabel={'登录'} handleLeft={handleRegister} handleRight={handleLogin} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 30,
    },
    title: {
        marginBottom: 30,
    },
});

export default AppRegister;
