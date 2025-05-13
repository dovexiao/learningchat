import api from './axios.ts';

export const getPosts = async (userId: string) => {
    try {
        const response = await api.get(`/forum/users/${userId}/posts`, {
            params: {
                userId,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const getPostDetail = async (postId: number) => {
    try {
        const response = await api.get(`/forum/posts/${postId}`, {
            params: {
                postId,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const getCommentDetail = async (commentId: number) => {
    try {
        const response = await api.get(`/forum/comments/${commentId}`, {
            params: {
                commentId,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const createPost = async (userId: number, content: string, tags: string[], images: number[]) => {
    try {
        const response = await api.post('/forum/posts/add', {
            userId,
            content,
            tags,
            images,
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const getRecentTags = async (userId: number) => {
    try {
        const response = await api.get(`/forum//users/${userId}/tags/recent`, {
            params: {
                userId,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const getRecommendedTags = async (userId: number) => {
    try {
        const response = await api.get(`/forum/users/${userId}/tags/recommended`, {
            params: {
                userId,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const getTagsByContent = async (content: string) => {
    try {
        const response = await api.get('/forum/tags/search', {
            params: {
                content,
            },
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const createTag = async (content: string) => {
    try {
        const response = await api.post('/forum/tags/add', {
            content,
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const commentPost = async (postId: number, userId: number, content: string) => {
    try {
        const response = await api.post(`/forum/posts/${postId}/comment`, {
            postId,
            userId,
            content,
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};

export const replyComment = async (commentId: number, userId: string, replyId: number, content: string) => {
    try {
        const response = await api.post(`/forum/comments/${commentId}/reply`, {
            commentId,
            userId,
            replyId,
            content,
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};
