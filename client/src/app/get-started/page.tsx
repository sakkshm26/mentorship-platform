"use client";
import NewLoader from "@/components/NewLoader";
import { Slider } from "@/components/Slider";
import { MultiSelect } from "@/components/dropdowns/Multiselect";
import { MultiSelectSpace } from "@/components/dropdowns/MutlselectSpace";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DOMAINS_WITH_SKILLS,
    DOMAIN_VALUE_TO_NAME_MAP,
    SKILL_VALUE_TO_NAME_MAP,
    addCommas,
} from "@/constants";
import AuthContext from "@/contexts/auth-context";
import api_client from "@/utils/axios";
import { denormalizeCurrency } from "@/utils/common";
import mixpanel from "mixpanel-browser";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { toast } from "react-toastify";

const GetStarted = () => {
    const router = useRouter();
    const user_context = useContext(AuthContext);
    const pcFormRef = useRef(null);
    const mobileFormRef = useRef(null);
    const searchParams = useSearchParams();
    const initialDomains = searchParams.get("domains")?.split(",");
    const [activeQuestion, setActiveQuestion] = useState(1);
    const [selectedDomains, setSelectedDomains] = useState<
        Record<"value" | "label", string>[]
    >(
        initialDomains?.length
            ? initialDomains[0]
                ? initialDomains?.map((item) => ({
                      label:
                          DOMAIN_VALUE_TO_NAME_MAP[item] ||
                          SKILL_VALUE_TO_NAME_MAP[item],
                      value: item,
                  }))
                : []
            : []
    );
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        experience_level: "",
        goal: "",
    });
    const [monthlyBudget, setMonthlyBudget] = useState([3000, 6000]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [continueButtonLoading, setContinueButtonLoading] = useState(false);

    const handleNext = async (e: any) => {
        e?.preventDefault();
        if (activeQuestion === 1) {
            if (!selectedDomains.length) {
                toast("Please select at least one domain", { type: "warning" });
                return;
            }
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("onboarding_domains_select");
            }
        } else if (activeQuestion === 2) {
            if (!/^\d{10}$/.test(formData.phone)) {
                return toast("Please enter a valid phone number", {
                    type: "warning",
                });
            }
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("onboarding_phone_name_submit");
            }
            try {
                setContinueButtonLoading(true);
                let formatted_domains: { label: string; value: string }[] = [];
                let skills: { label: string; value: string }[] = [];
                selectedDomains.forEach((domain) => {
                    if (
                        domain.value === "dsa" ||
                        domain.value === "java" ||
                        domain.value === "python" ||
                        domain.value === "react_js"
                    ) {
                        skills.push(domain);
                    } else {
                        formatted_domains.push(domain);
                    }
                });
                const response = await api_client.post(
                    "/internal/user/auth/phone-login-signup",
                    {
                        full_name: formData.full_name,
                        phone: `91${formData.phone}`,
                        domains: formatted_domains.map(
                            (domain) => domain.value
                        ),
                        skills: skills.map((skill) => skill.value),
                    }
                );
                localStorage.setItem(
                    "access_token",
                    response.data.access_token
                );
                localStorage.setItem(
                    "refresh_token",
                    response.data.refresh_token
                );
                localStorage.setItem(
                    "user_data",
                    JSON.stringify(response.data.user_data)
                );
                user_context.setUser!((prev: any) => ({
                    ...prev,
                    session: response.data.user_data,
                }));
                if (response.data.type === "login") {
                    user_context.setUser!((prev: any) => ({
                        ...prev,
                        session: response.data.user_data,
                    }));
                    router.push("/mentee/mentor-list");
                    setContinueButtonLoading(false);
                    return;
                }
                setContinueButtonLoading(false);
            } catch (err) {
                toast("Something went wrong. Please try again later.", {
                    type: "error",
                });
            }
        } else if (activeQuestion === 3) {
            if (!formData.experience_level.length) {
                return toast("Please select an option", { type: "warning" });
            }
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("onboarding_experience_select");
            }
        } else if (activeQuestion === 4) {
            if (!formData.goal.length) {
                return toast("Please select an option", { type: "warning" });
            }
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("onboarding_goal_select");
            }
        } else if (activeQuestion === 5) {
            setSubmitLoading(true);
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("onboarding_budget_select");
            }
            const denormalizedMonthlyBudgetMin = denormalizeCurrency({
                value: monthlyBudget[0],
                currency: "INR",
            });
            const denormalizedMonthlyBudgetMax = denormalizeCurrency({
                value: monthlyBudget[1],
                currency: "INR",
            });
            const response = await api_client.put("/internal/user/auth/phone-login-signup", {
                monthly_budget_min: denormalizedMonthlyBudgetMin,
                monthly_budget_max: denormalizedMonthlyBudgetMax,
                experience_level: formData.experience_level,
                goal: formData.goal,
            })
            router.push(
                `/mentee/mentor-list?domains=${response.data.domains
                    .map((item: any) => item.domain)
                    .join()}&skills=${response.data.skills
                    .map((item: any) => item.skill)
                    .join()}&monthly_budget_min=${
                    monthlyBudget[0] - 1000
                }&monthly_budget_max=${monthlyBudget[1] + 1000}`
            );
        }
        setActiveQuestion((prev) => prev + 1);
    };

    const handleMobileSubmit = () => {
        (mobileFormRef as any).current.requestSubmit();
    };

    const handlePCSubmit = () => {
        (pcFormRef as any).current.requestSubmit();
    };

    const question = () => {
        return (
            <div className="mt-2">
                {activeQuestion === 1 ? (
                    <div>
                        <p className="text-xl font-semibold">
                            First, tell us what you want to learn:
                        </p>
                        <div className="mt-8">
                            <MultiSelectSpace
                                options={DOMAINS_WITH_SKILLS.sort()}
                                selectedValues={selectedDomains}
                                setSelectedValues={setSelectedDomains}
                                inputClassNames="h-9"
                                showDropdownOnClick={true}
                            />
                        </div>
                    </div>
                ) : activeQuestion === 2 ? (
                    <div>
                        <p className="text-xl font-semibold">
                            Now, let's talk about you:
                        </p>
                        <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                            <Input
                                name="full_name"
                                placeholder="Full Name"
                                required={true}
                                value={formData.full_name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        full_name: e.target.value,
                                    }))
                                }
                            />
                            <Input
                                name="phone"
                                placeholder="Phone Number"
                                required={true}
                                value={
                                    formData.phone
                                        ? `+91 - ${formData.phone}`
                                        : ""
                                }
                                type="tel"
                                maxLength={16}
                                minLength={16}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        phone:
                                            e.target.value[0] === "+"
                                                ? e.target.value.slice(6)
                                                : e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                ) : activeQuestion === 3 ? (
                    <div>
                        <p className="text-xl font-semibold">You are:</p>
                        <div className="mt-8">
                            <div className="flex flex-col sm:flex-row justify-between sm:space-x-2">
                                <p
                                    className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer ${
                                        formData.experience_level === "student"
                                            ? "border-[#21695C] font-semibold"
                                            : "border-gray-200"
                                    } w-[50%]`}
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            experience_level: "student",
                                        }))
                                    }
                                >
                                    Student
                                </p>
                                <p
                                    className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer mt-4 sm:mt-0 ${
                                        formData.experience_level ===
                                        "working_professional"
                                            ? "border-[#21695C] font-semibold"
                                            : "border-gray-200"
                                    } w-[50%]`}
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            experience_level:
                                                "working_professional",
                                        }))
                                    }
                                >
                                    Working Professional
                                </p>
                            </div>
                            <p
                                className={`border-2 px-2.5 py-3 mt-4 rounded-lg text-sm cursor-pointer  ${
                                    formData.experience_level === "other"
                                        ? "border-[#21695C] font-semibold"
                                        : "border-gray-200"
                                }`}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        experience_level: "other",
                                    }))
                                }
                            >
                                Other
                            </p>
                        </div>
                    </div>
                ) : activeQuestion === 4 ? (
                    formData.experience_level === "student" ? (
                        <div>
                            <p className="text-xl font-semibold">
                                What's your goal?
                            </p>
                            <div className="mt-8">
                                <div className="flex flex-col sm:flex-row justify-between sm:space-x-2">
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer ${
                                            formData.goal === "upskilling"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "upskilling",
                                            }))
                                        }
                                    >
                                        Upskilling
                                    </p>
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer mt-4 sm:mt-0 ${
                                            formData.goal === "placements"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "placements",
                                            }))
                                        }
                                    >
                                        Placements
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between sm:space-x-2 mt-4">
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer ${
                                            formData.goal === "coursework"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "coursework",
                                            }))
                                        }
                                    >
                                        Coursework
                                    </p>
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer mt-4 sm:mt-0 ${
                                            formData.goal === "other"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "other",
                                            }))
                                        }
                                    >
                                        Other
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : formData.experience_level === "working_professional" ? (
                        <div>
                            <p className="text-xl font-semibold">
                                What's your goal?
                            </p>
                            <div className="mt-8">
                                <div className="flex flex-col sm:flex-row justify-between sm:space-x-2">
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer ${
                                            formData.goal === "job_switch"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "job_switch",
                                            }))
                                        }
                                    >
                                        Job Switch
                                    </p>
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer mt-4 sm:mt-0 ${
                                            formData.goal === "upskilling"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "upskilling",
                                            }))
                                        }
                                    >
                                        Upskilling
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between sm:space-x-2 mt-4">
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer ${
                                            formData.goal ===
                                            "domain_or_role_switch"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "domain_or_role_switch",
                                            }))
                                        }
                                    >
                                        Domain/Role Switch
                                    </p>
                                    <p
                                        className={`w-full border-2 px-2.5 py-3 rounded-lg text-sm cursor-pointer mt-4 sm:mt-0 ${
                                            formData.goal === "promotion"
                                                ? "border-[#21695C] font-semibold"
                                                : "border-gray-200"
                                        } w-[50%]`}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal: "promotion",
                                            }))
                                        }
                                    >
                                        Promotion
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xl font-semibold">
                                What's your goal?
                            </p>
                            <div className="mt-8">
                                <Select
                                    onValueChange={(val) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            goal: val,
                                        }))
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                        <SelectItem value="other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )
                ) : activeQuestion === 5 ? (
                    <div>
                        <p className="text-xl font-semibold">
                            What's your budget per month?
                        </p>
                        <p className="text-xs font-medium mt-3">
                            This step allows us to suggest more relevant tutors.
                        </p>
                        <div className="flex justify-between items-center mt-5">
                            <p className="text-sm font-medium">
                                Monthly Budget
                            </p>
                            <p className="text-xs font-medium border border-gray-200 py-1.5 px-4 rounded-lg">
                                ₹{addCommas(monthlyBudget[0])} - ₹
                                {addCommas(monthlyBudget[1])}
                            </p>
                        </div>
                        <Slider
                            minStepsBetweenThumbs={1}
                            min={3000}
                            max={40000}
                            step={1000}
                            defaultValue={monthlyBudget}
                            onValueChange={setMonthlyBudget}
                            className="w-full mt-5"
                        />
                    </div>
                ) : null}
            </div>
        );
    };

    if (submitLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[100vh]">
                <NewLoader />
                <p className="mt-6 text-sm font-semibold">
                    Matching you with our best mentors!
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Form for PCs */}
            {activeQuestion === 5 ? (
                <form
                    className="hidden sm:flex h-[100vh]"
                    ref={pcFormRef}
                    onSubmit={handleNext}
                >
                    <div className="w-[45%] lg:w-[40%] px-4 lg:px-16 flex flex-col justify-center bg-[#21695C] text-white m-3 lg:m-5 rounded-xl">
                        <p className="text-[28px] lg:text-[40px] leading-[40px] lg:leading-[50px] font-semibold">
                            What's your budget per month?
                        </p>
                        <p className="text-xs lg:text-sm mt-5 lg:mt-8">
                            This step allows us to suggest more relevant tutors.
                        </p>
                        <p className="font-medium text-xs lg:text-sm mt-5 lg:mt-8">
                            Question {activeQuestion} of 5
                        </p>
                    </div>
                    <div className="w-[55%] lg:w-[60%] flex flex-col justify-center px-8 lg:px-28">
                        <Slider
                            minStepsBetweenThumbs={1}
                            min={3000}
                            max={40000}
                            step={1000}
                            defaultValue={monthlyBudget}
                            onValueChange={setMonthlyBudget}
                            className="w-full"
                        />
                        <div className="flex justify-between mt-5">
                            <p className="font-medium">
                                ₹{addCommas(monthlyBudget[0])}
                            </p>
                            <p className="font-medium">
                                ₹{addCommas(monthlyBudget[1])}
                            </p>
                        </div>
                        <div className="mt-8 flex justify-between">
                            <Button
                                variant="primary"
                                className="text-xs w-[200px]"
                                type="submit"
                            >
                                Done, let's do this!
                            </Button>
                            <div className="flex items-center">
                                <GoArrowLeft
                                    className={`mr-3 h-[30px] md:h-[35px] w-[30px] md:w-[35px] border-2 border-gray-100 rounded-full p-[7px] cursor-pointer`}
                                    onClick={() =>
                                        setActiveQuestion((prev) => prev - 1)
                                    }
                                />
                                <GoArrowRight
                                    className="h-[30px] md:h-[35px] w-[30px] md:w-[35px] border-2 border-gray-100 rounded-full p-[7px] cursor-pointer"
                                    onClick={handlePCSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="hidden sm:flex justify-center">
                    <form
                        className="flex flex-col w-[600px] px-4"
                        ref={pcFormRef}
                        onSubmit={handleNext}
                    >
                        <img
                            src="/turtle/turtle_logo.svg"
                            className="h-12 w-24 mt-20 cursor-pointer"
                            onClick={() => router.push("/")}
                            alt="turtle_logo"
                        />
                        <p className="mt-20 font-semibold text-sm">
                            Question {activeQuestion}{" "}
                            <span className="text-[#cecece]">of 5</span>
                        </p>
                        {question()}
                        <div className="flex justify-between items-center mt-6">
                            <Button
                                variant="primary"
                                className="w-[7rem] text-xs"
                                type="submit"
                            >
                                {continueButtonLoading ? (
                                    <Loader />
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                            <div className="flex items-center">
                                <GoArrowLeft
                                    // size={40}
                                    className={`mr-3 h-[30px] md:h-[35px] w-[30px] md:w-[35px] border-2 border-gray-100 rounded-full p-[7px] ${
                                        activeQuestion === 1
                                            ? "text-gray-300"
                                            : "cursor-pointer"
                                    }`}
                                    onClick={() =>
                                        activeQuestion !== 1
                                            ? setActiveQuestion(
                                                  (prev) => prev - 1
                                              )
                                            : null
                                    }
                                />
                                <GoArrowRight
                                    className="h-[30px] md:h-[35px] w-[30px] md:w-[35px] border-2 border-gray-100 rounded-full p-[7px] cursor-pointer"
                                    onClick={handlePCSubmit}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Form for mobile phones */}
            <div className="flex sm:hidden">
                <form
                    className="flex flex-col w-[600px] px-4"
                    ref={mobileFormRef}
                    onSubmit={handleNext}
                >
                    <div className="flex justify-between mt-4">
                        <img
                            src="/turtle/turtle_logo.svg"
                            className="h-10 w-20 cursor-pointer"
                            onClick={() => router.push("/")}
                            alt="turtle_logo"
                        />
                        <div className="flex items-center">
                            <GoArrowLeft
                                // size={40}
                                className={`mr-3 h-[30px] md:h-[35px] w-[30px] md:w-[35px] border-2 border-gray-100 rounded-full p-[7px] ${
                                    activeQuestion === 1
                                        ? "text-gray-300"
                                        : "cursor-pointer"
                                }`}
                                onClick={() =>
                                    activeQuestion !== 1
                                        ? setActiveQuestion((prev) => prev - 1)
                                        : null
                                }
                            />
                            <GoArrowRight
                                className="h-[30px] md:h-[35px] w-[30px] md:w-[35px] border-2 border-gray-100 rounded-full p-[7px] cursor-pointer"
                                onClick={handleMobileSubmit}
                            />
                        </div>
                    </div>
                    <p className="mt-6 font-semibold text-sm">
                        Question {activeQuestion}{" "}
                        <span className="text-[#cecece]">of 5</span>
                    </p>
                    {question()}
                    <Button
                        variant="primary"
                        className="text-sm fixed bottom-4 left-4 right-4 h-12"
                        type="submit"
                    >
                        {activeQuestion === 5 ? (
                            "Done, let's do this!"
                        ) : continueButtonLoading ? (
                            <Loader />
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default GetStarted;
