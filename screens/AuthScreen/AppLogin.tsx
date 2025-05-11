import React from 'react';
import {StyleSheet, View} from 'react-native';
import SecureInput from '../../component/Input/SecureInput.tsx';
import NormalInput from '../../component/Input/Normalnput.tsx';
import DoubleButton from '../../component/Button/DoubleButton.tsx';
import {Button, Text, useTheme} from '@ui-kitten/components';
import { GithubIcon } from '../../component/Icon';
import {NavigationProps} from '../../types/navigationType.ts';
import CaptchaInput from '../../component/Input/CaptchaInput.tsx';
import * as api from '../../services/api/AuthApi.ts';
import * as TokenUtils from '../../services/auth/TokenUtils.ts';
import {errAlert} from '../../component/Alert/err.tsx';
import {useGlobal} from '../../hooks/GlobalContext.tsx';
import {useSocket} from '../../hooks/SocketContext.tsx';

const AppLogin: React.FC<NavigationProps> = ({ navigation }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [captchaKey, setCaptchaKey] = React.useState('');
    const [captchaText, setCaptchaText] = React.useState('');
    const [captchaSvg, setCaptchaSvg] = React.useState('');
    const { setUser } = useGlobal();
    const { connect } = useSocket();
    const themes = useTheme();

    const handleLogin = async () => {
       try {
           const { accessToken, refreshToken, userId, nickname, avatar, introduction } = await api.login(username, password, captchaKey, captchaText);
           await TokenUtils.setTokens(accessToken, refreshToken);
           setUser({ userId, nickname, avatar, introduction });
           connect(accessToken);
           await navigation.navigate('AppMain');
       } catch (error) {
           errAlert(error);
       }
    };

    const handleRegister = () => {
        navigation.navigate('AppRegister');
    };

    const getLoginCaptcha = async () => {
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
            await getLoginCaptcha();
        })();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: themes['background-basic-color-1'] }]}>
            <View style={styles.inputContainer}>
                <Text category={'h1'} style={styles.title} >登录</Text>
                <NormalInput label={'手机号码'} value={username} setValue={setUsername} caption={'请输入11位有效数字'} />
                <SecureInput label={'密码'} value={password} setValue={setPassword} caption={'请输入至少8位有效字符'} />
                <CaptchaInput label={'验证码'} value={captchaText} setValue={setCaptchaText} captchaSvg={captchaSvg} handleCaptcha={getLoginCaptcha} caption={'请输入有效答案'} />
                <DoubleButton leftLabel={'登录'} rightLabel={'注册'} handleLeft={handleLogin} handleRight={handleRegister} />
            </View>
            <View style={styles.thirdPartyContainer}>
                <Button appearance={'ghost'} size={'giant'} accessoryLeft={GithubIcon} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginBottom: 30,
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 30,
    },
    thirdPartyContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});

export default AppLogin;
