// src/services/socket/events.ts

export enum SocialEvent {
    // 加友
    FriendAdd = 'social:friend:add',
    FriendAddOffline = 'social:friend:add:offline',
}

export enum ChatEvent {
    // 单聊
    ChatPrivate = 'chat:private',       // 消息收发
    ChatPrivateOffline = 'chat:private:offline',
}
