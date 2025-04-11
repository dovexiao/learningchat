import api from './axios.ts';

export const getCaptcha = async () => {
    try {
        const response = await api.get('/auth/captcha');
        if  (response.data.success !== true) {
            throw response.data;
        }
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const register = async (username: string, password: string, captchaKey: string, captchaText: string) => {
    try {
        const response = await api.post('/auth/register', { username, password, captchaKey, captchaText });
        if  (response.data.success !== true) {
            throw response.data;
        }
        return response.data.success;
    } catch (error: any) {
        throw error;
    }
};

export const login = async (username: string, password: string, captchaKey: string, captchaText: string) => {
    try {
        const response = await api.post('/auth/login', { username, password, captchaKey, captchaText });
        if  (response.data.success !== true) {
            throw response.data;
        }
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};


