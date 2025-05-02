import * as keychain from '../storage/SecureStore.ts';
import { AxiosInstance }  from 'axios';

export const refreshTokens = async (api: AxiosInstance) => {
    try {
        const refreshTokenCache = await keychain.getRefreshToken();
        if (!refreshTokenCache) {
            return undefined;
        }
        const response = await api.post('/auth/refresh', {
            refreshToken: refreshTokenCache,
        });
        const { accessToken, refreshToken, userId, username } = response.data.data;
        await setTokens(accessToken, refreshToken);
        return { userId, username };
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

// 清空缓存
export const clearTokens = async () => {
    try {
        await keychain.clearTokens();
    } catch (error) {
        throw error;
    }
};
