import React from 'react';
import {errAlert} from '../component/Alert/err.tsx';
import * as TokenUtils from '../services/auth/TokenUtils.ts';
import api from '../services/api/axios.ts';
import { useSocket } from './SocketContext.tsx';
import { useGlobal } from './GlobalContext.tsx';

type AuthContextType = {
    isTokenRefreshed: boolean | undefined;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isTokenRefreshed, setIsTokenRefreshed] = React.useState<boolean | undefined>(undefined);

    const { connect } = useSocket();
    const { setUser } = useGlobal();

    // 刷新token并连接
    const refreshTokenAndConnect = async () => {
        try {
            const user = await TokenUtils.refreshTokens(api);
            const accessToken = await TokenUtils.getAccessToken();
            if (user && accessToken) {
                setUser({ userId: user.userId, nickname: user.nickname, avatar: user.avatar, introduction: user.introduction });
                setIsTokenRefreshed(true);
                connect(accessToken);
            } else {
                setIsTokenRefreshed(false);
            }
        } catch (error: any) {
            await TokenUtils.clearTokens();
            setIsTokenRefreshed(false);
            errAlert(error);
            // const code = error?.response?.data?.error?.details?.code;
            // if (error?.response && error.response.status === 401 && (code === 'INVALID_TOKEN' || code === 'EXPIRED_REFRESH')) {
            //     await TokenUtils.clearTokens();
            //     setIsTokenRefreshed(false);
            // } else {
            //     errAlert(error);
            // }
        }
    };

    React.useEffect(() => {
        (async () => {
            await refreshTokenAndConnect();
        })();
    }, []);

    const globalValue: AuthContextType = {
        isTokenRefreshed,
    };

    return (
        <AuthContext.Provider value={globalValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useGlobal must be used within an GlobalProvider');
    }
    return context;
};
