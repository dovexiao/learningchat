import React from 'react';
import TokenManager from '../services/auth/TokenManager.ts';
import {errAlert} from '../component/Alert/err.tsx';

type AuthContextType = {
    isTokenExpired: boolean | undefined;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isTokenExpired, setIsTokenExpired] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        (async () => {
            try {
                const token = await TokenManager.refreshToken();
                if (token) {
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
        <AuthContext.Provider value={{ isTokenExpired }}>
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
