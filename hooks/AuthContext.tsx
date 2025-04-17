import React from 'react';
import TokenManager from '../services/auth/TokenManager.ts';
import {errAlert} from '../component/Alert/err.tsx';

type User = {
    userId: number;
    username: string;
};

type AuthContextType = {
    isTokenExpired: boolean | undefined;
    getUser: () => User;
    setUser: (User: User) => void;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [userId, setUserId] = React.useState<number>(0);
    const [username, setUsername] = React.useState('');
    const [isTokenExpired, setIsTokenExpired] = React.useState<boolean | undefined>(undefined);

    const getUser = () => {
        return { userId, username};
    };

    const setUser = ({ userId, username }: User) => {
        setUserId(userId);
        setUsername(username);
    };

    React.useEffect(() => {
        (async () => {
            try {
                const user = await TokenManager.refreshToken();
                if (user) {
                    setUserId(user.userId);
                    setUsername(user.username);
                    setIsTokenExpired(true);
                } else {
                    setIsTokenExpired(false);
                }
            } catch (error: any) {
                if (error?.response && error.response.status === 401 && error.response.data.error.details.code === 'INVALID_TOKEN') {
                    await TokenManager.clearTokens();
                    setIsTokenExpired(false);
                }
                errAlert(error);
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ isTokenExpired, getUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
