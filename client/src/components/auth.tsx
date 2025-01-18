"use client";
import api_client from "@/utils/axios";
import { useState, useContext, useEffect } from "react";
import AuthContext from "@/contexts/auth-context";
import { useRouter, usePathname} from "next/navigation";
import { toast } from 'react-toastify';
import { supabaseClient } from "@/supabase/client";
import { Input } from "./ui/input";
import Image from "next/image";

interface AuthProps {
    type: "login" | "signup";
}

export default function Auth({ type }: AuthProps) {
    const router = useRouter();
    const user_context = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        //TODO: Save last login type (mentor or mentee) and redirect to the corresponding route on successive auths
        try {
            if (type === "login") {
                const response = await api_client.post('/internal/user/auth/login', formData);
                await supabaseClient.auth.signInWithPassword({ email: formData.email, password: formData.password });
                if (response.data.mentor_id) {
                    router.push("/mentor/dashboard");
                } else if (response.data.mentee_id) {
                    router.push("/mentee/mentor-list");
                } else {
                    router.push("/mentee-onboarding");
                }
            } else {
                const response = await api_client.post('/internal/user/auth/signup', formData);
                await supabaseClient.auth.signUp({ email: formData.email, password: formData.password, options: { data: { user_id: response.data.user_id } } });
                //TODO: Add mentor or mentee query param to know if the signup was started for mentor or mentee and redirect accordingly
                router.push("/mentee-onboarding");
            }
        } catch (err) {
            console.log(err)
            toast("Something went wrong", { type: "error" });
        }
    }

    return (
        <section className="dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <Image priority src="/logo.svg" className="mb-6" height={60} width={60} alt="" />
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-xl">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {type === "login" ? "Sign In to your account" : "Create your account"}
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com"
                                    required={true}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                    }}
                                    maxLength={40}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="********"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required={true}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                    }}
                                    minLength={8}
                                    maxLength={40}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-gray-700 hover:bg-black focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                {type === "login" ? "Sign In" : "Sign Up"}
                            </button>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {type === "login" ? `Don’t have an account yet? ` : `Already have an account? `}
                                <a
                                    href={type === "login" ? "/signup" : "/login"}
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    {type === "login" ? "Sign Up" : "Sign In"}
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
