import api from './axios.ts';

export const getSpacesByName = async (userId: string, name: string) => {
    try {
        const response = await api.get('/chat/chat-spaces/name', {
            params: {
                userId,
                name,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};
