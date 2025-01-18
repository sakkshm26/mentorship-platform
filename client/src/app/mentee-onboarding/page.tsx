"use client";
import ProtectedRoute from "@/utils/protectedRoute";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { SKILLS } from "@/constants";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import api_client from "@/utils/axios";
import AuthContext from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import { toast } from "react-toastify";
import { supabaseClient } from "@/supabase/client";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/Slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/dropdowns/Multiselect";
import { Input } from "@/components/ui/input";
import { denormalizeCurrency } from "@/utils/common";

const MenteeOnboarding = () => {
    const user_context = useContext(AuthContext);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        experience_level: "",
    });
    const [selectedSkills, setSelectedSkills] = useState<Record<"value" | "label", string>[]>([]);
    const [monthlyBudget, setMonthlyBudget] = useState([0, 5000]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedSkills.length) {
            toast("Please select atleast one skill", { type: "warning" });
            return;
        }
        try {
            const skills = selectedSkills.map((skill) => skill.value);
            await api_client.put("/internal/user", {
                full_name: formData.name,
                phone: `91${formData.phone}`,
            });
            const create_mentee_response = await api_client.post(
                "/internal/mentee"
            , {
                experience_level: formData.experience_level,
                monthly_budget_max: denormalizeCurrency({ value: monthlyBudget[1], currency: "INR" }),
                monthly_budget_min: denormalizeCurrency({ value: monthlyBudget[0], currency: "INR" }),
                skills
            });
            await supabaseClient.auth.updateUser({
                data: { mentee_id: create_mentee_response.data.id },
            });
            await supabaseClient.auth.refreshSession();
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    useEffect(() => {
        /* if (user_context.session?.user.user_metadata.mentee_id) {
            router.push("/mentee/mentor-list");
        } */
        router.push("/");
    }, [user_context]);

    return user_context?.is_loading ||
        // user_context?.session?.user.user_metadata.mentee_id ? (
        user_context?.session?.mentee_id ? (
        <Loader global={true} />
    ) : (
        <section className="text-sm">
            <div className="flex items-center justify-center md:h-screen">
                <div className="bg-white md:rounded-3xl shadow p-5 md:p-12 flex flex-row max-w-6xl">
                    <div className="w-full md:w-2/4">
                        <form onSubmit={handleSubmit}>
                            <h1 className="mb-4 font-semibold font-switzer text-xl lg:text-2xl">
                                Help us with your number, and we’ll match you
                                with the best tutor
                            </h1>
                            <div className="py-1"></div>
                            <div className="flex flex-col">
                                <label className="text-sm">Name</label>
                                <div className="py-1"></div>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="py-3"></div>
                            <div className="flex flex-col">
                                <label className="text-sm">Phone Number</label>
                                <div className="py-1"></div>
                                <Input
                                    type="text"
                                    name="phone"
                                    placeholder="9876543210"
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
                            <div className="py-3"></div>
                            <div className="flex flex-col">
                                <label className="text-sm">
                                    I'm currently a
                                </label>
                                <div className="py-1"></div>
                                <Select required name="experience_level" onValueChange={val => setFormData(prev => ({ ...prev, experience_level: val }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fresher">
                                            Fresher
                                        </SelectItem>
                                        <SelectItem value="working_professional">
                                            Working Professional
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="py-3"></div>
                            <div className="flex flex-col">
                                <label className="text-sm">
                                    Skills you want to learn
                                </label>
                                <div className="py-1"></div>
                                <MultiSelect
                                    options={SKILLS}
                                    selectedValues={selectedSkills}
                                    setSelectedValues={setSelectedSkills}
                                />
                            </div>
                            <div className="py-2"></div>
                            <div className="flex flex-col">
                                <label className="text-sm">
                                    Monthly Budget
                                </label>
                                <div className="py-1"></div>
                                <Slider
                                    minStepsBetweenThumbs={1}
                                    min={0}
                                    max={50000}
                                    step={1000}
                                    defaultValue={monthlyBudget}
                                    onValueChange={setMonthlyBudget}
                                    className={cn("w-full")}
                                />
                                <div className="h-2"></div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-semibold">
                                        ₹{monthlyBudget[0]}
                                    </p>
                                    <p className="text-xs font-semibold">
                                        ₹{monthlyBudget[1]}
                                    </p>
                                </div>
                            </div>
                            <div className="py-5"></div>
                            <PrimaryButton
                                text="Get Started"
                                extra_props={{ type: "submit" }}
                            />
                        </form>
                    </div>
                    <div className="w-20 hidden md:block"></div>
                    <div className="w-2/4 hidden md:flex">
                        <Image
                            priority
                            src="/onboarding.svg"
                            height={532}
                            width={532}
                            alt="Onboarding"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProtectedRoute(MenteeOnboarding);
