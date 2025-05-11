import React, {useRef} from 'react';
import BottomModal from '../component/Modal/BottomModal.tsx';
import Message from '../component/Modal/Message.tsx';

type User = {
    userId: string;
    nickname: string;
    avatar: string;
    introduction: string;
};

type GlobalContextType = {
    userId: string;
    nickname: string;
    avatar: string;
    introduction: string;
    setUser: (user: User) => void;
    centerModalRef: any;
    bottomModalRef: any;
    messageRef: any;
};

export const GlobalContext = React.createContext<GlobalContextType | null>(null);

export const GlobalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [userId, setUserId] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [avatar, setAvatar] = React.useState('');
    const [introduction, setIntroduction] = React.useState('');
    const centerModalRef = useRef<any>(null);
    const bottomModalRef = useRef<any>(null);
    const messageRef = useRef<any>(null);

    const setUser = (user: User) => {
        setUserId(user.userId);
        setNickname(user.nickname);
        setAvatar(user.avatar);
        setIntroduction(user.introduction);
    };

    const globalValue: GlobalContextType = {
        userId,
        nickname,
        avatar,
        introduction,
        setUser,
        centerModalRef,
        bottomModalRef,
        messageRef,
    };

    return (
        <GlobalContext.Provider value={globalValue}>
            {children}
            <BottomModal ref={bottomModalRef} />
            <Message ref={messageRef}/>
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = React.useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within an GlobalProvider');
    }
    return context;
};
