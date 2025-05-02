import axios, { AxiosInstance }  from 'axios';
import ENV_CONFIG from '../../config/env.config.ts';
import * as TokenUtils  from '../auth/TokenUtils.ts';

const api: AxiosInstance = axios.create({
    baseURL: ENV_CONFIG.API_BASE,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await TokenUtils.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // 输出请求信息的 JSON
        setTimeout(() => {
            console.log('请求信息 JSON:', config);
        }, 0);
        return config;
    } catch (error) {
        throw error;
    }
});

api.interceptors.response.use((response) => {
    // 输出响应信息的 JSON
    setTimeout(() => {
        console.log('响应信息 JSON:', response);
    }, 0);
    return response;
}, async (resError) => {
    try {
        if (resError.response.status === 401 && resError.response.data.error.details.code === 'EXPIRED_TOKEN') {
            console.log('Token 过期，正在刷新 Token...');
            await TokenUtils.refreshTokens(api);
            return api.request(resError.config);
        }
        // 输出错误响应信息的 JSON
        setTimeout(() => {
            console.log('错误响应信息 JSON:', resError);
        }, 0);
        return Promise.reject(resError);
    } catch (error) {
        throw error;
    }
});

export default api;
