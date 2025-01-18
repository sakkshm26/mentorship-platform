"use client";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import COUNTRY_CODES from "@/lib/country-codes.json";
import api_client from "@/utils/axios";
import { supabaseClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/auth-context";
import { DOMAINS, DOMAINS_WITH_SKILLS } from "@/constants";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Slider } from "./Slider";
import PrimaryButton from "./buttons/PrimaryButton";
import { MultiSelect } from "./dropdowns/Multiselect";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { denormalizeCurrency } from "@/utils/common";
import { Button } from "./ui/button";
import { PhoneInput } from "./new-website/phoneInput";
import { customFBEvent } from "@/lib/fbp";
import * as pixel from "@/lib/fbp";
import mixpanel from "mixpanel-browser";

export const MenteeForm = ({
    initialDomains,
    runAfterSubmit,
}: {
    initialDomains: any;
    runAfterSubmit?: any;
}) => {
    const user_context = useContext(AuthContext);
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        experience_level: "",
    });
    const [selectedDomains, setSelectedDomains] =
        useState<Record<"value" | "label", string>[]>(initialDomains);
    const [monthlyBudget, setMonthlyBudget] = useState([3000, 6000]);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (
            formData.phone.length < 10 ||
            (formData.phone.slice(0, 3) === "+91" &&
                formData.phone.length !== 13) ||
            formData.phone[3] === "0" ||
            formData.phone[3] === "1" ||
            formData.phone[3] === "2" ||
            formData.phone[3] === "3" ||
            formData.phone[3] === "4" ||
            formData.phone[3] === "5" ||
            formData.phone
                .slice(-5)
                .split("")
                .every((char) => char === formData.phone[12])
        ) {
            return toast("Please enter a valid phone number", {
                type: "warning",
            });
        }
        if (!formData.experience_level) {
            return toast("Please select your experience", { type: "warning" });
        }
        if (!selectedDomains.length) {
            return toast("Please select at least one domain/skill", {
                type: "warning",
            });
        }
        setSubmitLoading(true);
        try {
            const event_id = Date.now();
            customFBEvent("form_submit", {}, event_id.toString());
            await pixel.sendFBConversionEvent({
                isLoggedIn: false,
                event_name: "form_submit",
                event_id,
            });
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("form_submit");
            }
            const denormalizedMonthlyBudgetMin = denormalizeCurrency({
                value: monthlyBudget[0],
                currency: "INR",
            });
            const denormalizedMonthlyBudgetMax = denormalizeCurrency({
                value: monthlyBudget[1],
                currency: "INR",
            });
            const skills: { label: string; value: string }[] = [];
            let formatted_domains: { label: string; value: string }[] = [];
            selectedDomains.forEach((domain) => {
                if (
                    domain.value === "dsa" ||
                    domain.value === "python" ||
                    domain.value === "java" ||
                    domain.value === "react_js"
                ) {
                    skills.push({ label: domain.label, value: domain.value });
                } else {
                    formatted_domains.push(domain);
                }
            });
            const response = await api_client.post(
                "/internal/user/auth/phone-signup",
                {
                    full_name: formData.full_name,
                    phone: formData.phone.slice(1),
                    experience_level: formData.experience_level,
                    domains: formatted_domains.map((domain) => domain.value),
                    skills: skills.map((skill) => skill.value),
                    monthly_budget_min: denormalizedMonthlyBudgetMin,
                    monthly_budget_max: denormalizedMonthlyBudgetMax,
                }
            );
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            localStorage.setItem(
                "user_data",
                JSON.stringify(response.data.user_data)
            );
            user_context.setUser!((prev: any) => ({
                ...prev,
                session: response.data.user_data,
            }));
            runAfterSubmit
                ? runAfterSubmit()
                : router.push(
                      `/mentee/mentor-list?domains=${formatted_domains
                          .map((item) => item.value)
                          .join()}&skills=${skills
                          .map((item) => item.value)
                          .join()}&monthly_budget_min=${
                          monthlyBudget[0] - 1000
                      }&monthly_budget_max=${monthlyBudget[1] + 1000}`
                  );
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
        setSubmitLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="mb-3 font-switzer text-lg lg:text-xl leading-6">
                Help us with your number, and we’ll match you with the best
                mentor
            </h1>
            <div className="py-0.5 md:py-1"></div>
            <div className="flex flex-col">
                <label className="text-sm">Name</label>
                <Input
                    type="text"
                    name="full_name"
                    placeholder="John Doe"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                        }))
                    }
                    className="mt-0.5"
                />
            </div>
            <div className="py-1.5"></div>
            <div className="flex flex-col">
                <label className="text-sm">Phone Number</label>
                <PhoneInput
                    name="phone"
                    required
                    value={formData.phone}
                    maxLength={20}
                    minLength={10}
                    onChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            phone: value,
                        }))
                    }
                    className="mt-0.5"
                />
                <p className="text-xs mt-1 text-gray-400">
                    We promise to never spam you!
                </p>
            </div>
            <div className="py-1.5"></div>
            <div className="flex flex-col">
                <label className="text-sm">You are</label>
                <Select
                    onValueChange={(val) =>
                        setFormData((prev) => ({
                            ...prev,
                            experience_level: val,
                        }))
                    }
                    required
                >
                    <SelectTrigger className="mt-0.5">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="working_professional">
                            Working Professional
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* <div className="py-2"></div>
            <div className="flex flex-col">
                <label className="text-sm">What's your goal?</label>
                <Select
                    onValueChange={(val) =>
                        setFormData((prev) => ({
                            ...prev,
                            goal: val,
                        }))
                    }
                    required
                >
                    <SelectTrigger className="mt-0.5">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {formData.experience_level === "student" ? (
                            <>
                                <SelectItem value="upskilling">
                                    Upskilling
                                </SelectItem>
                                <SelectItem value="placements">
                                    Placements
                                </SelectItem>
                                <SelectItem value="coursework">
                                    Coursework
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </>
                        ) : formData.experience_level ===
                          "working_professional" ? (
                            <>
                                <SelectItem value="job_switch">
                                    Job Switch
                                </SelectItem>
                                <SelectItem value="upskilling">
                                    Upskilling
                                </SelectItem>
                                <SelectItem value="domain_or_role_switch">
                                    Domain/Role Switch
                                </SelectItem>
                                <SelectItem value="promotion">
                                    Promotion
                                </SelectItem>
                            </>
                        ) : formData.experience_level === "other" ? (
                            <>
                                <SelectItem value="upskilling">
                                    Upskilling
                                </SelectItem>
                                <SelectItem value="placements">
                                    Placements
                                </SelectItem>
                                <SelectItem value="coursework">
                                    Coursework
                                </SelectItem>
                                <SelectItem value="job_switch">
                                    Job Switch
                                </SelectItem>
                                <SelectItem value="domain_or_role_switch">
                                    Domain/Role Switch
                                </SelectItem>
                                <SelectItem value="promotion">
                                    Promotion
                                </SelectItem>
                                <SelectItem value="unemployed_looking_for_job">
                                    Unemployed, looking for a job
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </>
                        ) : null}
                    </SelectContent>
                </Select>
            </div> */}
            <div className="py-1.5"></div>
            <div className="flex flex-col">
                <label className="text-sm">
                    Domains/skills you want to learn more about
                </label>
                <div className="py-0.5"></div>
                <MultiSelect
                    placeholder="DSA, Full Stack, AI"
                    options={DOMAINS_WITH_SKILLS.sort()}
                    selectedValues={selectedDomains}
                    setSelectedValues={setSelectedDomains}
                    showDropdownOnClick={true}
                    showFurtherPlaceholder={true}
                />
            </div>
            <div className="py-1"></div>
            <div className="flex flex-col">
                <label className="text-sm">Monthly Budget</label>
                <div className="py-1"></div>
                <Slider
                    minStepsBetweenThumbs={1}
                    min={3000}
                    max={20000}
                    step={1000}
                    defaultValue={monthlyBudget}
                    onValueChange={setMonthlyBudget}
                    className={cn("w-full")}
                />
                <div className="h-2"></div>
                <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold">₹{monthlyBudget[0]}</p>
                    <p className="text-xs font-semibold">₹{monthlyBudget[1]}</p>
                </div>
            </div>
            <div className="py-3"></div>
            <Button
                disabled={submitLoading}
                type="submit"
                className="w-full mb-5"
                variant="primary"
            >
                Get started →
            </Button>
        </form>
    );
};
