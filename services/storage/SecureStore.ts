import Keychain from 'react-native-keychain';

export const setTokens = async (access: string, refresh: string) => {
    try {
        await Promise.all([
            Keychain.setGenericPassword('access', access, { service: 'auth_access' }),
            Keychain.setGenericPassword('refresh', refresh, { service: 'auth_refresh' }),
        ]);
    } catch (error) {
        throw error;
    }
};

export const getAccessToken = async () => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'auth_access' });
        if (credentials) {
            return credentials.password;
        } else {
            // Alert.alert('Error', 'No access token found.');
            return undefined;
        }
    } catch (error) {
        throw error;
    }
};

export const getRefreshToken = async () => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'auth_refresh' });
        if (credentials) {
            return credentials.password;
        } else {
            // Alert.alert('Error', 'No refresh token found.');
            return undefined;
        }
    } catch (error) {
        throw error;
    }
};
