import React, { useContext, useState } from "react";
import PrimaryButton from "./buttons/PrimaryButton";
import { Input } from "./ui/input";
import { toast } from "react-toastify";
import api_client from "@/utils/axios";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/auth-context";

const PhoneLoginForm = () => {
    const [formData, setFormData] = useState({ phone: "" });
    const [submitLoading, setSubmitLoading] = useState(false);
    const router = useRouter();
    const user_context = useContext(AuthContext);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setSubmitLoading(true);
            const response = await api_client.post("/internal/user/auth/phone-login", {
                phone: `91${formData.phone}`,
            });
            localStorage.setItem("access_token", response.data.access_token)
            localStorage.setItem("refresh_token", response.data.refresh_token)
            localStorage.setItem("user_data", JSON.stringify(response.data.user_data));
            router.push("/mentee/mentor-list");
            user_context.setUser!((prev: any) => ({ ...prev, session: response.data.user_data }));
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    return (
        <div className="space- md:space-y-6 ">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label className="text-sm">Phone Number</label>
                    <div className="py-1"></div>
                    <Input
                        type="text"
                        name="phone"
                        placeholder="1111122222"
                        maxLength={10}
                        minLength={10}
                        required
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                phone: e.target.value,
                            })
                        }
                    />
                </div>
                <PrimaryButton
                    text="Login →"
                    loading={submitLoading}
                    extra_props={{ type: "submit" }}
                    class_names="bg-primary w-full h-12"
                />
            </form>
        </div>
    );
};

export default PhoneLoginForm;
