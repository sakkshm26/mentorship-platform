"use client";
import { createContext, useState, useEffect } from 'react';

interface UserContextType {
    is_loading: boolean;
    api_key?: string,
    setUser?: any
}

const AuthContext = createContext<UserContextType>({ is_loading: true });

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState({ is_loading: true });

    useEffect(() => {
        const api_key = localStorage.getItem('api_key');
        if (api_key) {
            setUser(prev => ({ ...prev, is_loading: false, api_key }));
        } else {
            setUser(prev => ({ ...prev, is_loading: false }));
        }
    }, []);

    return <AuthContext.Provider value={{ ...user, setUser }} children={children} />;
};

export default AuthContext;