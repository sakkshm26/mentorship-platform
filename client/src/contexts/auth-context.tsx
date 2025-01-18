"use client";
import { createContext, useState, useEffect } from 'react';
import { supabaseClient } from "../supabase/client";
import { Session } from '@supabase/supabase-js';

interface UserContextType {
    is_loading: boolean;
    // session?: Session,
    session?: { user_id: string, mentor_id?: string, mentee_id?: string },
    setUser?: any
}

const AuthContext = createContext<UserContextType>({ is_loading: true });

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState({ is_loading: true });

    /* useEffect(() => {
        const { data } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                setUser(prev => ({ ...prev, session: null }));
            }
            if (session) {
                setUser(prev => ({ ...prev, is_loading: false, session }));
            } else {
                setUser(prev => ({ ...prev, is_loading: false }));
            }
        });
        return () => {
            data.subscription.unsubscribe();
        };
    }, []); */

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        const user_data = localStorage.getItem('user_data');
        if (access_token && refresh_token && user_data) {
            setUser(prev => ({ ...prev, is_loading: false, session: JSON.parse(user_data) }));
        } else {
            setUser(prev => ({ ...prev, is_loading: false }));
        }
    }, []);

    return <AuthContext.Provider value={{ ...user, setUser }} children={children} />;
};

export default AuthContext;