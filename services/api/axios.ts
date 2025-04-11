import axios from 'axios';
import ENV_CONFIG from '../../config/env.config.ts';
import { getAccessToken, refreshAllToken } from './utils.ts';

const api = axios.create({
    baseURL: ENV_CONFIG.API_BASE,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // 输出请求信息的 JSON
        console.log('请求信息 JSON:', JSON.stringify({
            method: config.method,
            url: `${config.baseURL ?? ''}${config.url ?? ''}`,
            headers: config.headers,
            params: config.params,
            data: config.data,
        }, null, 2));
        return config;
    } catch (error) {
        throw error;
    }
});

api.interceptors.response.use((response) => {
    // 输出响应信息的 JSON
    console.log('响应信息 JSON:', JSON.stringify({
        status: response.status,
        headers: response.headers,
        data: response.data,
    }, null, 2));
    return response;
}, async (resError) => {
    try {
        if (resError.response?.status === 401 && resError.response.data?.error?.details !== 'EXPIRED_REFRESH') {
            await refreshAllToken(api);
            return api.request(resError.config);
        }
        // 输出错误响应信息的 JSON
        console.log('错误响应信息 JSON:', JSON.stringify({
            status: resError.response?.status,
            headers: resError.response?.headers,
            data: resError.response?.data,
        }, null, 2));
        return Promise.reject(resError);
    } catch (error) {
        throw error;
    }
});

export default api;
