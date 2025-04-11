import {getAccessToken, refreshAllToken, setTokens} from '../api/utils.ts';
import api from '../api/axios.ts';

class TokenManager {
    async getAccessToken() {
        try {
            return getAccessToken();
        } catch(error) {
            throw error;
        }
    }
    async refreshToken() {
        try {
            return refreshAllToken(api);
        } catch(error) {
            throw error;
        }
    }
    async setTokens(accessToken: string, refreshToken: string) {
        try {
            await setTokens(accessToken, refreshToken);
        } catch (error) {
            throw error;
        }
    }
}

export default new TokenManager();
