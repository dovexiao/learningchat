import React from 'react';
import TokenManager from '../services/auth/TokenManager.ts';
import {errAlert} from '../component/Alert/err.tsx';

type User = {
    userId: string;
    username: string;
};

type AuthContextType = {
    isTokenExpired: boolean | undefined;
    getUser: () => User;
    setUser: (User: User) => void;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [userId, setUserId] = React.useState<string>('');
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
            } catch (error) {
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
