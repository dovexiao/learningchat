export interface systemNotificationType {
    mid: string,
    from: {
        userId: string,
        nickname: string,
        avatar: string,
        introduction: string,
    },
    to: {
        userId: string,
        nickname: string,
        avatar: string,
        introduction: string,
    },
    body: any,
    timestamp: string,
}
