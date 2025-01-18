"use client";
import Auth from "@/components/auth";
import Loader from "@/components/loader";
import AuthContext from "@/contexts/auth-context";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Login() {
    const router = useRouter();
    const user_context = useContext(AuthContext);
    useEffect(() => {
        /* if (user_context?.session) {
            if (user_context?.session.user.user_metadata.mentee_id) {
                router.push("/mentee/mentor-list")
            } else {
                router.push("/mentee-onboarding")
            }
        } */
        router.push("/");
    }, [user_context])

    return (
        // user_context?.is_loading || user_context?.session ? <Loader global={true} /> : <Auth type="login" />
        <Loader global={true} />
    );
}