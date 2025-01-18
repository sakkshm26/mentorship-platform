import { MentorCardProps } from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    COMPANY_LOGO_FORMAT_MAP,
    COMPANY_LOGO_SIZE_MAP,
    SKILL_VALUE_TO_NAME_MAP,
} from "@/constants";
import { customFBEvent } from "@/lib/fbp";
import api_client from "@/utils/axios";
import { normalizeCurrency } from "@/utils/common";
import axios from "axios";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import * as pixel from "@/lib/fbp";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const ListMentorCard = (mentor_data: MentorCardProps) => {
    const [loading, setLoading] = useState(false);
    const [showFullAbout, setShowFullAbout] = useState(false);
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailFormData, setEmailFormData] = useState({
        email: "",
        interest: "",
    });
    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
    const router = useRouter();
    const company_name = mentor_data.job_experiences[0].organization_name
        .toLowerCase()
        .replaceAll(" ", "_");

    const displayRazorpay = async (mentor_id: string) => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            toast("Payment gateway failed to load", { type: "error" });
            return;
        }
        let order_response;
        if (mentor_data.session_id) {
            order_response = await axios.post(
                process.env.NEXT_PUBLIC_BASE_URL +
                    "/payment-gateway/order/trial/session",
                {
                    mentor_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${mentor_data.session_id}`,
                    },
                }
            );
        } else {
            order_response = await api_client.post(
                "/payment-gateway/order/trial",
                {
                    mentor_id,
                }
            );
        }
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order_response.data.amount,
            currency: order_response.data.currency,
            name: "Turtle",
            description: "Trial Booking Transaction",
            image: "/turtle/turtle_logo.svg",
            order_id: order_response.data.order_id,
            handler: function (response: any) {
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

    const bookTrial = async (e: any) => {
        e.preventDefault();
        setSubmitButtonLoading(true);
        try {
            const event_id = Date.now();
            customFBEvent("book_intro_session", {}, event_id.toString());
            await pixel.sendFBConversionEvent({
                isLoggedIn: true,
                event_name: "book_intro_session",
                event_id,
            });
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("book_intro_session");
            }
            if (mentor_data.session_id) {
                await axios.post(
                    process.env.NEXT_PUBLIC_BASE_URL +
                        "/internal/mentee/session-new-booking",
                    {
                        mentor_id: mentor_data.id,
                        email: emailFormData.email,
                        interest: emailFormData.interest,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${mentor_data.session_id}`,
                        },
                    }
                );
            } else {
                await api_client.post("/internal/mentee/new-booking", {
                    mentor_id: mentor_data.id,
                    email: emailFormData.email,
                    interest: emailFormData.interest,
                });
            }
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

    const bookTrialWithRazorpay = async () => {
        setLoading(true);
        try {
            const event_id = Date.now();
            customFBEvent("book_intro_session", {}, event_id.toString());
            await pixel.sendFBConversionEvent({
                isLoggedIn: true,
                event_name: "book_intro_session",
                event_id,
            });
            if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
                mixpanel.track("book_intro_session");
            }
            await displayRazorpay(mentor_data.id);
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
        setLoading(false);
    };

    return (
        <Card
            className="w-full mb-14 px-3 md:px-6 py-8 rounded-xl"
            key={mentor_data.id}
        >
            <Dialog open={emailDialogOpen}>
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
                    <form onSubmit={bookTrial}>
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
                            placeholder="johndoe@email.com"
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
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="relative flex justify-center items-center flex-shrink-0 h-[100%] w-[100%] sm:h-auto sm:w-auto">
                    <img
                        src={
                            mentor_data.profile_image_url
                                ? mentor_data.profile_image_url
                                : "/user_profile_placeholder.jpg"
                        }
                        alt="mentor profile image"
                        className="rounded-xl h-[90%] w-[90%] sm:h-48 sm:w-48"
                    />
                    {COMPANY_LOGO_SIZE_MAP[company_name] ? (
                        <div
                            className="items-center hidden sm:flex absolute z-20"
                            style={{
                                bottom: COMPANY_LOGO_SIZE_MAP[company_name]?.pc
                                    .bottom
                                    ? COMPANY_LOGO_SIZE_MAP[company_name]?.pc
                                          .bottom
                                    : 10,
                                left: COMPANY_LOGO_SIZE_MAP[company_name]?.pc
                                    .left
                                    ? COMPANY_LOGO_SIZE_MAP[company_name]?.pc
                                          .left
                                    : 10,
                            }}
                        >
                            <img
                                src={`/turtle/company_logos_without_names/${company_name}.${
                                    COMPANY_LOGO_FORMAT_MAP[company_name] ||
                                    "svg"
                                }`}
                                className={`rounded-sm ${
                                    company_name === "amazon" ? "bg-white" : ""
                                }`}
                                alt="company logo"
                                style={{
                                    height: COMPANY_LOGO_SIZE_MAP[company_name]
                                        ?.pc.height,
                                    width: COMPANY_LOGO_SIZE_MAP[company_name]
                                        ?.pc.width,
                                }}
                            />

                            <p className="text-lg text-white font-medium ml-2">
                                {mentor_data.job_experiences[0]
                                    .organization_name ===
                                "Tower Research Capital"
                                    ? "TRC"
                                    : mentor_data.job_experiences[0]
                                          .organization_name ===
                                      "Dell Technologies"
                                    ? "Dell"
                                    : mentor_data.job_experiences[0]
                                          .organization_name}
                            </p>
                        </div>
                    ) : null}
                    {COMPANY_LOGO_SIZE_MAP[company_name] ? (
                        <div
                            className="items-center flex sm:hidden absolute z-20"
                            style={{
                                bottom: COMPANY_LOGO_SIZE_MAP[company_name]
                                    ?.phone?.bottom
                                    ? COMPANY_LOGO_SIZE_MAP[company_name]?.phone
                                          ?.bottom
                                    : 14,
                                left: COMPANY_LOGO_SIZE_MAP[company_name]?.phone
                                    ?.left
                                    ? COMPANY_LOGO_SIZE_MAP[company_name]?.phone
                                          ?.left
                                    : 30,
                            }}
                        >
                            <img
                                src={`/turtle/company_logos_without_names/${company_name}.${
                                    COMPANY_LOGO_FORMAT_MAP[company_name] ||
                                    "svg"
                                }`}
                                alt="company logo"
                                className={`rounded-sm ${
                                    company_name === "amazon" ? "bg-white" : ""
                                }`}
                                style={{
                                    height: COMPANY_LOGO_SIZE_MAP[company_name]
                                        ?.phone?.height,
                                    width: COMPANY_LOGO_SIZE_MAP[company_name]
                                        ?.phone?.width,
                                }}
                            />
                            <p className="text-[25px] text-white font-medium ml-2">
                                {mentor_data.job_experiences[0]
                                    .organization_name ===
                                "Tower Research Capital"
                                    ? "TRC"
                                    : mentor_data.job_experiences[0]
                                          .organization_name ===
                                      "Dell Technologies"
                                    ? "Dell"
                                    : mentor_data.job_experiences[0]
                                          .organization_name}
                            </p>
                        </div>
                    ) : null}
                    <div
                        className="absolute inset-0 mx-[5%] sm:mx-0"
                        style={{
                            backgroundImage:
                                "linear-gradient(to top, rgb(0, 0, 0) -300%, transparent)",
                            borderRadius: 13,
                        }}
                    />
                </div>
                <div className="mt-8 sm:mt-0 sm:ml-8 w-[100%]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <p className="hidden sm:block font-semibold text-[20px]">
                                {mentor_data.full_name}
                            </p>
                            <p className="sm:hidden font-semibold text-[20px]">
                                {mentor_data.full_name.split(" ")[0] +
                                    " " +
                                    (mentor_data.full_name.split(" ")[1]
                                        ? mentor_data.full_name.split(" ")[1]
                                        : "")}
                            </p>
                            <p className="ml-3 text-[12px] font-semibold bg-[#F8F8F8] py-1 px-2.5">
                                {mentor_data.years_experience} YOE
                            </p>
                        </div>
                        {mentor_data.linkedin_url ? (
                            <img
                                src="/turtle/company_logos_without_names/linkedin.svg"
                                className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                                onClick={() =>
                                    window.open(mentor_data.linkedin_url)
                                }
                            />
                        ) : null}
                    </div>
                    {mentor_data.external_rating &&
                    mentor_data.session_count ? (
                        <div className="mt-3 flex">
                            <div className="flex">
                                <FaStar
                                    className="text-[#FFD700] mt-[1px]"
                                    size={15}
                                />
                                <p className="ml-1 text-sm font-medium">
                                    {mentor_data.external_rating}
                                </p>
                            </div>
                            <div className="flex ml-8 sm:ml-12">
                                <MdGroups size={20} />
                                <p className="ml-1 text-sm">
                                    <span className="font-medium">
                                        {mentor_data.session_count}+
                                    </span>{" "}
                                    sessions
                                </p>
                            </div>
                        </div>
                    ) : null}
                    <p className="text-sm mt-3">{mentor_data.heading}</p>
                    <div className="flex flex-wrap mt-4">
                        {showAllSkills ? (
                            mentor_data.skills.map((skill) => (
                                <p className="font-medium text-[11px] mr-1.5 bg-[#F8F8F8] py-0.5 px-2.5 mb-[6px!important]">
                                    {SKILL_VALUE_TO_NAME_MAP[skill]}
                                </p>
                            ))
                        ) : (
                            <>
                                {mentor_data.skills
                                    ?.slice(0, 6)
                                    ?.map((skill) => (
                                        <p className="font-medium text-[11px] mr-1.5 bg-[#F8F8F8] py-0.5 px-2.5 mb-[6px!important]">
                                            {SKILL_VALUE_TO_NAME_MAP[skill]}
                                        </p>
                                    ))}
                                {mentor_data.skills?.length > 6 ? (
                                    <p
                                        className="text-blue-500 cursor-pointer text-[13px] ml-2"
                                        onClick={() => setShowAllSkills(true)}
                                    >
                                        +{mentor_data.skills.length - 6} more
                                    </p>
                                ) : null}
                            </>
                        )}
                    </div>
                    <p className="mt-4 text-[13px]">
                        {showFullAbout ? (
                            mentor_data.about
                        ) : (
                            <>
                                {mentor_data.about?.slice(0, 200)}{" "}
                                {mentor_data.about?.length > 200 ? (
                                    <>
                                        ...{" "}
                                        <span
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() =>
                                                setShowFullAbout(true)
                                            }
                                        >
                                            View More
                                        </span>
                                    </>
                                ) : null}
                            </>
                        )}
                    </p>
                    <hr className="mt-4" />
                    <div className="mt-5 flex justify-between items-center">
                        <div>
                            <p className="text-sm">
                                <span className="font-semibold">4x</span>{" "}
                                sessions
                            </p>
                            <p className="text-[20px] font-semibold mt-1">
                                ₹
                                {normalizeCurrency({
                                    value: mentor_data.per_month_fee,
                                    currency: "INR",
                                })}{" "}
                                <span className="text-[16px]">/ month</span>
                            </p>
                        </div>
                        {mentor_data.trial_fee < 40000 ? (
                            <Button
                                variant="primary"
                                className="w-[10rem] font-medium text-[14px]"
                                onClick={() => {
                                    setEmailDialogOpen(true);
                                }}
                            >
                                Free Trial &nbsp;
                                <span className="font-normal line-through">
                                    ₹
                                    {normalizeCurrency({
                                        value: mentor_data.trial_fee,
                                        currency: "INR",
                                    })}
                                </span>
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="w-[10rem] font-medium text-[14px]"
                                onClick={() => {
                                    bookTrialWithRazorpay();
                                }}
                                disabled={loading}
                            >
                                Book Trial -&nbsp;
                                <span className="font-normal">
                                    ₹
                                    {normalizeCurrency({
                                        value: mentor_data.trial_fee,
                                        currency: "INR",
                                    })}
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ListMentorCard;
