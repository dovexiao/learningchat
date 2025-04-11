import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationProps} from '../../types/navigationType.tsx';
import { Text } from '@ui-kitten/components';
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
    const [captchaText, setCaptchaTExt] = React.useState('');
    const [captchaSvg, setCaptchaSvg] = React.useState('');

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

    const getCaptcha = async () => {
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
            await getCaptcha();
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text category={'h1'} style={styles.title} >注册</Text>
            <NormalInput value={username} setValue={setUsername}/>
            <SecureInput value={password} setValue={setPassword} />
            <CaptchaInput value={captchaText} setValue={setCaptchaTExt} captchaSvg={captchaSvg} handleCaptcha={getCaptcha}/>
            <DoubleButton leftLabel={'注册'} rightLabel={'登录'}  handleLeft={handleRegister} handleRight={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginBottom: 100,
    },
    title: {
        marginBottom: 30,
    },
});

export default AppRegister;
