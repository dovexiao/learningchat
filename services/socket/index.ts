// src/services/socket/index.ts
import { io, Socket } from 'socket.io-client';
import * as TokenUtils from '../auth/TokenUtils.ts';
import api from '../api/axios.ts';

const SOCKET_URL = 'http://192.168.215.198:8082';

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private listeners = new Map<string, (...args: any[]) => void>();

    // 单例模式
    public static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    // 初始化连接
    public connect(token: string) {
        if (this.socket?.connected) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            path: '/socket.io',
            auth: { token },
            transports: ['websocket'], // 强制WebSocket协议
            reconnection: false,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        });

        this.socket.on('connect', () => {
            console.log('Socket连接成功', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                (async () => {
                    await TokenUtils.refreshTokens(api);
                    const newToken = await TokenUtils.getAccessToken();
                    if (newToken) {
                        this.reconnect(newToken);
                    }
                })();
            }
            // else the socket will automatically try to reconnect
        });
    }

    // 重新连接（带清理）
    public reconnect(token: string) {
        this.cleanup(); // 先清理旧连接
        this.connect(token); // 建立新连接
    }

    // 断开连接
    public disconnect(): void {
        this.cleanup();
    }

    // 清空所有监听器并断开连接
    public cleanup() {
        if (this.socket) {
            this.socket.removeAllListeners(); // 一键清除所有监听器
            this.socket.disconnect();
        }
        this.socket = null;
    }

    public on(event: string, listener: (...args: any[]) => void) {
        this.socket?.on(event, listener);
    }

    public off(event: string, listener?: (...args: any[]) => void) {
        if (listener) {
            this.socket?.off(event, listener);
        } else {
            this.socket?.off(event);
        }
    }

    // 获取Socket实例
    public getSocket(): Socket | null {
        return this.socket;
    }
}

export default SocketService.getInstance();
