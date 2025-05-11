// src/services/socket/hooks/SocketContext.tsx
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import SocketService from '../services/socket';
import {SocialEvent} from '../services/socket/events.ts';

type SocketContextType = {
    connect: (token: string) => void;
    disconnect: () => void;
    isConnected: boolean | undefined;
    subscribe: <T>(event: string, handler: (payload: T, ack: T) => void) => void;
    unsubscribe: (event: string, handler: (...args: any[]) => void) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean | undefined>(undefined);

    // 新增订阅监听器
    const subscribe = useCallback(<T,>(event: string, handler: (payload: T, ack: T) => void) => {
        SocketService.on(event, handler);
    }, []);

    const unsubscribe = useCallback((event: string, handler: (...args: any[]) => void) => {
        SocketService.off(event, handler);
    }, []);

    // 连接与状态监听
    const connect = (token: string) => {
        SocketService.connect(token);
        // 注册状态监听
        SocketService.on('connect', () => setIsConnected(true));
        SocketService.on('disconnect', () => setIsConnected(false));
    };

    // 断开连接
    const disconnect = () => {
        SocketService.disconnect();
    };

    // 清理监听
    useEffect(() => {
        return () => {
            SocketService.cleanup();
        };
    }, []);

    const socketContextValue: SocketContextType = {
        connect,
        disconnect,
        isConnected,
        subscribe,
        unsubscribe,
    };

    return (
        <SocketContext.Provider value={socketContextValue}>
            {children}
        </SocketContext.Provider>
    );
};

// 自定义Hook
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within an GlobalProvider');
    }
    return context;
};
