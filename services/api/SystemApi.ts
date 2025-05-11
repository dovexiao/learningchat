import api from "./axios.ts";

export const sendFriendAdd = async (mid: string | null, userId: string, targetUserId: string, status: string, leaveMessage?: string) => {
    try {
        const response = await api.post('/system/system-notification/sendNotification', {
            mid,
            userId,
            targetUserId,
            status,
            leaveMessage,
        });
        return response.data.data;
    } catch (error: any) {
        throw error;
    }
};
