"use client";
import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import AuthContext from "@/contexts/auth-context";
import api_client from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const user_context = useContext(AuthContext);
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await api_client.post("/admin/auth/login", formData);
            localStorage.setItem("api_key", response.data.api_key);
            user_context.setUser!((prev: any) => ({
                ...prev,
                api_key: response.data.api_key,
            }));
            router.push("/");
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    useEffect(() => {
        if (!user_context.is_loading && user_context.api_key) {
            router.push("/");
        }
    }, [user_context]);

    return (
        user_context.is_loading || user_context.api_key ? <Loader global={true}/> : <section className="dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-xl">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login
                </h1>
                <form
                    className="space-y-4 md:space-y-6"
                    onSubmit={handleSubmit}
                >
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
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                });
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
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                });
                            }}
                            minLength={8}
                            maxLength={40}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-gray-700 hover:bg-black focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
        </div>
    </section>
    );
};

export default page;
