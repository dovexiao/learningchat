import api from './axios.ts';

export const uploadImage = async (image: any) => {
    try {
        const response = await api.post('/resource/upload/image', {
            image,
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};
