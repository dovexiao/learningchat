export interface ChatSpaceType {
    spaceId: string,        // 用户Id或者群聊Id
    type: 'friend' | 'group',
    name: string,
    avatar: string,
    introduction: string,
    latestMessage: string,
    unread: number,
    timestamp: string,
}

export interface ChatMessagesType {
    mid: string,
    spaceId: string,
    from: {
        userId: string,
        nickname: string,
        avatar: string,
        introduction: string,
    },
    content: {
        type: 'text' | 'image' | 'file',        // 消息类型
        body: string,       // 文本内容/图片URL/文件URL
        metadata?: {        // 扩展元数据
            size?: number,      // 文件大小（单位字节）
            width?: number,     // 图片宽度（像素）
            height?: number,        // 图片高度（像素）
            fileName?: string,      // 文件名（文件类型时）
            [key: string]: any,     // 其他自定义字段
        };
    },
    timestamp: string,
}

export interface ChatSpaceSearchType {
    groups: user[],
    users: group[]
}

type user = {
    userId: string,
    nickname: string,
    avatar: string,
    introduction: string,
}

type group = {
    groupId: string,
    groupName: string,
    groupAvatar: string,
    introduction: string,
}
