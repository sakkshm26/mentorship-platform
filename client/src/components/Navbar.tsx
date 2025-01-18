import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "./loader";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { supabaseClient } from "@/supabase/client";
import api_client from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import AuthContext from "@/contexts/auth-context";

export interface UserDataProps {
    id?: string;
    email?: string;
    phone?: string;
    full_name?: string;
}

export const Navbar = (user_data: UserDataProps) => {
    const router = useRouter();
    const user_context = useContext(AuthContext);
    const handleLogout = async () => {
        try {
            // await supabaseClient.auth.signOut();
            await api_client.post("/internal/user/auth/logout");
            localStorage.clear();
            user_context.setUser!((prev: any) => ({
                ...prev,
                session: undefined,
            }));
            router.push("/");
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    return user_data ? (
        <nav className="flex justify-between items-center mx-3 sm:mx-10 mt-3">
            <Image
                priority
                src="/turtle/turtle_logo.svg"
                height={100}
                width={100}
                className="hidden sm:block cursor-pointer"
                alt=""
                onClick={() => router.push("/")}
            />
            <Image
                priority
                src="/turtle/turtle_logo_without_text.svg"
                height={30}
                width={30}
                className="sm:hidden cursor-pointer rounded-sm"
                alt=""
                onClick={() => router.push("/")}
            />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarFallback className="bg-[#f2f2f2]">
                            {user_data.full_name && user_data.full_name[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel
                        onClick={handleLogout}
                        className="cursor-pointer"
                    >
                        Logout
                    </DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    ) : (
        <Loader />
    );
};
