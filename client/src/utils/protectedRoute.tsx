"use client";
import AuthContext from "@/contexts/auth-context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function ProtectedRoute(Component: any) {
    return function ProtectedComponent (props: any) {
        const user_context = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {
            if (!user_context.is_loading && !user_context.session) {
                // router.push("/login");
                router.push("/");
            }
        }, [user_context]);

        if (user_context.is_loading) {
            return <Loader global={true} />
        }

        if (!user_context.session) {
            return null;
        }

        return <Component {...props} />;
    };
};
