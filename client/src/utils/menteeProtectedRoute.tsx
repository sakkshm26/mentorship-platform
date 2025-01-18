"use client";
import AuthContext from "@/contexts/auth-context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import NewLoader from "@/components/NewLoader";

export default function MenteeProtectedRoute(Component: any) {
    return function MenteeProtectedComponent (props: any) {
        const user_context = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {
            /* if (!user_context.is_loading && !user_context.session?.user.user_metadata.mentee_id) {
                router.push("/login");
            } */
            if (!user_context.is_loading && !user_context.session?.mentee_id) {
                router.push("/");
            }
        }, [user_context]);

        if (user_context.is_loading) {
            return <NewLoader global={true} />
        }

        if (!user_context.session) {
            return null;
        }

        return <Component {...props} />;
    };
};
