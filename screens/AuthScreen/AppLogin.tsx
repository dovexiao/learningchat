import React from 'react';
import {StyleSheet, View} from 'react-native';
import SecureInput from '../../component/Input/SecureInput.tsx';
import NormalInput from '../../component/Input/Normalnput.tsx';
import DoubleButton from '../../component/Button/DoubleButton.tsx';
import {Button, Text} from '@ui-kitten/components';
import { GithubIcon } from '../../component/Icon';
import {NavigationProps} from '../../types/navigationType.tsx';
import CaptchaInput from '../../component/Input/CaptchaInput.tsx';
import * as api from '../../services/api/AuthApi.ts';
import TokenManager from '../../services/auth/TokenManager.ts';
import {errAlert} from '../../component/Alert/err.tsx';
import {useAuth} from '../../hooks/AuthContext.tsx';

const AppLogin: React.FC<NavigationProps> = ({ navigation }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [captchaKey, setCaptchaKey] = React.useState('');
    const [captchaText, setCaptchaTExt] = React.useState('');
    const [captchaSvg, setCaptchaSvg] = React.useState('');
    const { setUser } = useAuth();

    const handleLogin = async () => {
       try {
           const { accessToken, refreshToken, user } = await api.login(username, password, captchaKey, captchaText);
           await TokenManager.setTokens(accessToken, refreshToken);
           setUser(user);
           await navigation.navigate('AppMain');
       } catch (error) {
           errAlert(error);
       }
    };

    const handleRegister = () => {
        navigation.navigate('AppRegister');
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
            <View style={styles.inputContainer}>
                <Text category={'h1'} style={styles.title} >登录</Text>
                <NormalInput value={username} setValue={setUsername}/>
                <SecureInput value={password} setValue={setPassword} />
                <CaptchaInput value={captchaText} setValue={setCaptchaTExt} captchaSvg={captchaSvg} handleCaptcha={getCaptcha}/>
                <DoubleButton leftLabel={'登录'} rightLabel={'注册'}  handleLeft={handleLogin} handleRight={handleRegister} />
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
        // flex: 1,
        // height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 30,
        // backgroundColor: 'blue',
    },
    thirdPartyContainer: {
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
});

export default AppLogin;
