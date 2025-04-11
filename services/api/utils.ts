import * as keychain from '../storage/SecureStore.ts';
import * as Axios from 'axios';
import AxiosInstance = Axios.AxiosInstance;

const refreshTokenFn = async (api: AxiosInstance, refreshToken: string) => {
    try {
        const response = await api.post('/auth/refresh', { refreshToken: refreshToken });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const refreshAllToken = async (api: AxiosInstance ) => {
    const rfToken = await keychain.getRefreshToken();
    if (!rfToken) {
        return undefined;
    }
    try {
        const { accessToken, refreshToken } = await refreshTokenFn(api, rfToken);
        await setTokens(accessToken, refreshToken);
        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

export const getAccessToken = async () => {
    try {
        return await keychain.getAccessToken();
    } catch (error) {
        throw error;
    }
};

export const setTokens = async (accessToken: string, refreshToken: string) => {
    try {
        await keychain.setTokens(accessToken, refreshToken);
    } catch (error) {
        throw error;
    }
};
