// src/services/socket/events.ts

export enum SocialEvent {
    // 加友
    FriendAdd = 'social:friend:add',
    FriendAddAccept = 'social:friend:add:accept',
    FriendAddOffline = 'social:friend:add:offline',
}

export enum ChatEvent {
    // 单聊
    ChatPrivate = 'chat:private',       // 消息收发
    ChatPrivateOffline = 'chat:private:offline',
}

export enum SystemEvent {
    // 系统通知
    SystemNotification = 'system:notification',
    SystemNotificationOffline = 'system:notification:offline',
}
