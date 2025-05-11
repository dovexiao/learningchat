import api from './axios.ts';

export const getSpacesByName = async (userId: string, name: string) => {
    try {
        const response = await api.get('/chat/chat-spaces/search-name', {
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

export const sendChatMessage = async (userId: string, spaceId: string, content: string) => {
    try {
        const response = await api.post('/chat/chat-spaces/send', {
            userId,
            spaceId,
            content,
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};
