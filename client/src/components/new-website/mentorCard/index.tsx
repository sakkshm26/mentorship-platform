import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    COMPANY_LOGO_FORMAT_MAP,
    COMPANY_LOGO_SIZE_MAP,
    SKILL_VALUE_TO_NAME_MAP,
} from "@/constants";
import { normalizeCurrency } from "@/utils/common";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";
import { PhoneInput } from "../phoneInput";
import { toast } from "react-toastify";
import api_client from "@/utils/axios";
import mixpanel from "mixpanel-browser";
import AuthContext from "@/contexts/auth-context";
import { Textarea } from "@/components/ui/textarea";
import { MenteeForm } from "@/components/MenteeForm";
import * as pixel from "@/lib/fbp";

const loadScript = (src: string) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        document.body.appendChild(script);
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
    });
};

interface MentorCardProps {
    id: string;
    profile_image_url?: string;
    full_name: string;
    skills: string[];
    companies: string[];
    years_experience: number;
    about: string;
    heading: string;
    per_month_fee: number;
    trial_fee: number;
    job_experiences: Array<any>;
    setFormOpenFromCard: any;
}

const MentorCard = (props: MentorCardProps) => {
    const router = useRouter();
    const company_name =
        props.full_name === "Rinal Praveen"
            ? "uber"
            : props.job_experiences[0].organization_name
                  .toLowerCase()
                  .replaceAll(" ", "_");
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ full_name: "", phone: "" });
    const [emailFormData, setEmailFormData] = useState({
        email: "",
        interest: "",
    });
    const [formOpen, setFormOpen] = useState(false);
    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [activeMentorID, setActiveMentorID] = useState("");
    const user_context = useContext(AuthContext);

    const displayRazorpay = async () => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            toast("Payment gateway failed to load", { type: "error" });
            return;
        }
        let order_response = await api_client.post(
            "/payment-gateway/order/trial",
            {
                mentor_id: props.id,
            }
        );
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order_response.data.amount,
            currency: order_response.data.currency,
            name: "Turtle",
            description: "Trial Booking Transaction",
            image: "/turtle/turtle_logo.svg",
            order_id: order_response.data.order_id,
            handler: function (response: any) {
                setSubmitButtonLoading(false);
                router.push("/payment-success");
            },
            prefill: {
                name: order_response.data.full_name,
                email: "",
                contact: order_response.data.phone?.slice(2),
            },
            theme: {
                color: "#000000",
            },
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

    /* const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitButtonLoading(true);
        try {
            if (formData.phone.length < 10) {
                toast("Please enter a valid phone number", { type: "warning" });
            }
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("mentor_filter_form_submit");
            }
            const response = await api_client.post(
                "/internal/user/auth/phone-login-signup",
                {
                    full_name: formData.full_name,
                    phone: formData.phone.slice(1),
                    domains: [],
                    skills: [],
                    mentor_id:
                        props.trial_fee < 40000 ? activeMentorID : undefined,
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
            if (props.trial_fee < 40000) {
                toast("Success! Our team will get in touch with you soon.", {
                    type: "success",
                });
            } else {
                displayRazorpay();
            }
            setDialogOpen(false);
        } catch (err: any) {
            toast("Something went wrong", { type: "error" });
        }
        setSubmitButtonLoading(false);
    }; */

    const handleCreateTrial = async (e: any) => {
        e.preventDefault();
        setSubmitButtonLoading(true);
        try {
            const event_id = Date.now();
            pixel.customFBEvent("book_intro_session", {}, event_id.toString());
            await pixel.sendFBConversionEvent({
                isLoggedIn: false,
                event_name: "book_intro_session",
                event_id,
            });
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("book_intro_session");
            }
            await api_client.post("/internal/mentee/new-booking", {
                mentor_id: activeMentorID,
                email: emailFormData.email,
                interest: emailFormData.interest,
            });
            setEmailDialogOpen(false);
            toast("Success! Our team will get in touch with you soon.", {
                type: "success",
            });
        } catch (err: any) {
            toast(err?.response?.data?.message || "Something went wrong", {
                type: "error",
            });
        }
        setSubmitButtonLoading(false);
    };

    const runAfterSubmit = async () => {
        setFormOpen(false);
        if (props.trial_fee < 40000) {
            setEmailDialogOpen(true);
        } else {
            displayRazorpay();
        }
    };

    useEffect(() => {
        props.setFormOpenFromCard(formOpen);
    }, [formOpen]);

    return (
        <div className="w-[300px] flex flex-col border-2 border-gray-100 px-3 py-4 rounded-2xl">
            <Dialog
                open={formOpen}
                onOpenChange={(value) => setFormOpen(value)}
            >
                <DialogContent className="bld flex gap-10 rounded-2xl md:p-10 max-h-[95%] md:max-h-[auto] max-w-[92vmin] md:max-w-5xl overflow-y-scroll">
                    <div className="w-full shrink-0 md:basis-1/2">
                        <MenteeForm
                            initialDomains={[]}
                            runAfterSubmit={runAfterSubmit}
                        />
                    </div>
                    <div className="hidden grow items-center bg-[#f3fffd] px-4 md:flex">
                        <img
                            src="/turtle/form_image.png"
                            alt="lady tutoring online"
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={emailDialogOpen}
                onOpenChange={(val) => (val ? null : setActiveMentorID(""))}
            >
                <DialogContent
                    className="sm:max-w-[425px] top-48 sm:top-1/2"
                    onPointerDownOutside={() => setEmailDialogOpen(false)}
                >
                    <div
                        className="cursor-pointer absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        onClick={() => setEmailDialogOpen(false)}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </div>
                    <form onSubmit={handleCreateTrial}>
                        <p className="font-semibold mb-[7px!important] ">
                            20-min Intro Call with Mentor
                        </p>
                        <p className="text-gray-400 text-xs mb-[20px!important]">
                            Plan your personalized roadmap with a mentor and
                            clear all your doubts regarding mentorship.
                        </p>
                        <label className="text-xs font-medium">
                            Enter Your Email{" "}
                            <span className="text-red-600">*</span>
                        </label>
                        <Input
                            name="email"
                            placeholder="Email"
                            required={true}
                            type="email"
                            value={emailFormData.email}
                            onChange={(e) =>
                                setEmailFormData((prev: any) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            className="mt-1 mb-[10px!important]"
                        />
                        <label className="text-xs font-medium">
                            What do you expect out of this session?{" "}
                            <span className="text-red-600">*</span>
                        </label>
                        <Textarea
                            name="interest"
                            required={true}
                            value={emailFormData.interest}
                            onChange={(e) =>
                                setEmailFormData((prev: any) => ({
                                    ...prev,
                                    interest: e.target.value,
                                }))
                            }
                            className="mt-1"
                            minLength={20}
                            placeholder="Please write breifly about your expectations from the mentorship."
                        />

                        <Button
                            className="bg-[#21695C] hover:bg-[#1A4F44] mt-10 w-full"
                            type="submit"
                            disabled={submitButtonLoading}
                        >
                            Book Session
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <div className="relative flex justify-center items-center flex-shrink-0 h-[100%] w-[100%] sm:h-auto sm:w-auto">
                <img
                    src={
                        props.profile_image_url
                            ? props.profile_image_url
                            : "/user_profile_placeholder.jpg"
                    }
                    className="h-64 w-full rounded-md"
                    alt="user profile"
                />
                {props.full_name === "Rinal Praveen" ? (
                    <p className="absolute bottom-9 left-3 text-[16px] font-bold z-10">
                        Ex
                    </p>
                ) : null}
                {COMPANY_LOGO_SIZE_MAP[company_name] ? (
                    <div
                        className="items-center flex absolute z-20"
                        style={{
                            bottom: COMPANY_LOGO_SIZE_MAP[company_name]?.pc
                                .bottom
                                ? COMPANY_LOGO_SIZE_MAP[company_name]?.pc.bottom
                                : 10,
                            left: COMPANY_LOGO_SIZE_MAP[company_name]?.pc.left
                                ? COMPANY_LOGO_SIZE_MAP[company_name]?.pc.left
                                : 10,
                        }}
                    >
                        <img
                            src={`/turtle/company_logos_without_names/${company_name}.${
                                COMPANY_LOGO_FORMAT_MAP[company_name] || "svg"
                            }`}
                            className={`rounded-sm ${
                                company_name === "amazon" ? "bg-white" : ""
                            }`}
                            alt="company logo"
                            style={{
                                height: COMPANY_LOGO_SIZE_MAP[company_name]?.pc
                                    .height,
                                width: COMPANY_LOGO_SIZE_MAP[company_name]?.pc
                                    .width,
                            }}
                        />
                        <p className="text-2xl text-white font-medium ml-3">
                            {props.job_experiences[0].organization_name ===
                            "Tower Research Capital"
                                ? "TRC"
                                : props.job_experiences[0].organization_name ===
                                  "Dell Technologies"
                                ? "Dell"
                                : props.full_name === "Rinal Praveen"
                                ? null
                                : props.job_experiences[0].organization_name}
                        </p>
                    </div>
                ) : null}
                {props.full_name === "Rinal Praveen" ? (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "linear-gradient(to top, rgb(255, 255, 255) -270%, transparent)",
                            borderRadius: 6,
                        }}
                    />
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "linear-gradient(to top, rgb(0, 0, 0) -300%, transparent)",
                            borderRadius: 6,
                        }}
                    />
                )}
            </div>
            <div className="pt-6 pb-2">
                <div className="flex items-center">
                    <p className="text-lg font-semibold">
                        {props.full_name.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-xs font-semibold bg-[#F8F8F8] px-2 py-0.5 rounded-sm ml-3">
                        {props.years_experience} YOE
                    </p>
                </div>
                <p className="text-[13px] mt-2">{props.heading}</p>
                <div className="flex space-x-2 overflow-x-scroll whitespace-nowrap mt-3">
                    {props.skills
                        .slice(0, Math.min(3, props.skills.length))
                        .map((skill) => (
                            <p className="text-[11px] font-medium bg-[#f8f8f8] px-3 py-0.5 mb-0">
                                {SKILL_VALUE_TO_NAME_MAP[skill]}
                            </p>
                        ))}
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[13px] mb-0">Starting from</p>
                        <p className="mb-0 mt-2 text-[15px] font-semibold">
                            ₹{" "}
                            {normalizeCurrency({
                                currency: "INR",
                                value: props.per_month_fee,
                            })}{" "}
                            / month
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        className="bg-[#21695C] text-xs"
                        onClick={() => {
                            if (user_context.session) {
                                setActiveMentorID(props.id);
                                if (props.trial_fee < 40000) {
                                    setEmailDialogOpen(true);
                                } else {
                                    displayRazorpay();
                                }
                            } else {
                                setActiveMentorID(props.id);
                                setFormOpen(true);
                            }
                        }}
                    >
                        {props.trial_fee < 40000 ? (
                            <p>
                                Free Trial{" "}
                                <span className="line-through">
                                    ₹
                                    {normalizeCurrency({
                                        currency: "INR",
                                        value: props.trial_fee,
                                    })}
                                </span>
                            </p>
                        ) : (
                            <p>
                                Book Trial - ₹
                                {normalizeCurrency({
                                    currency: "INR",
                                    value: props.trial_fee,
                                })}
                            </p>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MentorCard;
