import { Card } from "@/components/ui/card";
import { SKILL_VALUE_TO_NAME_MAP } from "@/constants";
import { PiGraduationCapLight } from "react-icons/pi";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "react-toastify";
import api_client from "@/utils/axios";
import Loader from "./loader";
import { Button } from "./ui/button";
import { normalizeCurrency } from "@/utils/common";

export interface MentorCardProps {
    id: string;
    full_name: string;
    heading: string;
    about: string;
    trial_fee: number;
    per_month_fee: number;
    profile_image_url?: string;
    years_experience: number;
    job_experiences: {
        organization_name: string;
        position: string;
        start_date: string;
        end_date?: string;
    }[];
    active: boolean;
    skills: string[];
    onClick?: () => void;
}

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
}

export const MentorCard = (mentor_data: MentorCardProps) => {
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const displayRazorpay = async (mentor_id: string) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast("Payment gateway failed to load", { type: "error" });
            return;
        }
        const order_response = await api_client.post("/payment-gateway/order/trial", {
            mentor_id
        })
        const options = {
            "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            "amount": order_response.data.amount,
            "currency": order_response.data.currency,
            "name": "Turtle",
            "description": "Trial Booking Transaction",
            "image": "/logo.svg",
            "order_id": order_response.data.order_id,
            "handler": function (response: any){},
            "prefill": {
                "name": order_response.data.full_name,
                "email": "",
                "contact": order_response.data.phone?.slice(2)
            },
            "theme": {
                "color": "#000000"
            }
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    }

    const bookTrial = async () => {
        setLoading(true);
        try {
            await displayRazorpay(mentor_data.id);
            /* await api_client.post("/internal/mentee/booking", {
                mentor_id: mentor_data.id,
            });
            toast("Success! Our team will get in touch with you soon.", {
                type: "success",
            }); */
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
        setLoading(false);
        setDialogOpen(false);
    };

    return (
        <Card
            className={`w-full lg:w-[1000px] mt-4 px-3 md:px-6 py-6 ${mentor_data.active ? "border-2 border-red-600" : ""}`}
            key={mentor_data.id}
        >
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <img
                    src={
                        mentor_data.profile_image_url
                            ? mentor_data.profile_image_url
                            : "/user_profile_placeholder.jpg"
                    }
                    alt="mentor_profile"
                    className="rounded-xl h-48 w-48"
                />
                <div className="h-6 w-6"></div>
                <div className="w-full overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between w-[calc(100vw-30px)] sm:w-[calc(100vw-40px)] md:w-full">
                        <div>
                            <div className="flex items-center justify-between md:justify-normal">
                                <p className="font-bold text:lg md:text-xl">
                                    {mentor_data.full_name}
                                </p>
                                <div className="w-4"></div>
                                <p
                                    className="text-xs px-2 py-1 rounded-lg font-semibold"
                                    style={{
                                        color: "#3749D9",
                                        backgroundColor: "#F0F2FF",
                                    }}
                                >
                                    {mentor_data.years_experience} yoe
                                </p>
                            </div>
                            <div className="h-3"></div>
                            <div className="flex items-center w-full">
                                <div>
                                    <PiGraduationCapLight
                                        className="mr-3"
                                        size={15}
                                    />
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 pr-3">
                                    {mentor_data.skills
                                        ?.map(
                                            (skill) =>
                                                SKILL_VALUE_TO_NAME_MAP[skill]
                                        )
                                        .join(", ")}
                                </p>
                            </div>
                        </div>
                        {mentor_data.job_experiences ? (
                            <div className="flex md:hidden space-x-2 mt-6 overflow-x-auto">
                                {mentor_data.job_experiences.map((job) => (
                                    <Card className="flex-none w-44 px-3 py-2">
                                        <p className="text-xs font-bold">
                                            {job.position.length > 20
                                                ? job.position.substring(
                                                      0,
                                                      20
                                                  ) + "..."
                                                : job.position}
                                        </p>
                                        <p className="text-xs mt-1">
                                            {job.organization_name.length > 24
                                                ? job.organization_name.substring(
                                                      0,
                                                      24
                                                  ) + "..."
                                                : job.organization_name}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        ) : null}
                        <div className="md:hidden mt-4">
                            <p className="font-semibold text-sm">About:</p>
                            <p className="text-gray-500 text-xs mt-1">
                                {mentor_data.about}
                            </p>
                        </div>
                        <div className="mt-5 md:mt-0">
                            <p className="text-center md:text-left text-sm md:text-md">
                                Monthly Fee:{" "}
                                <span className="font-semibold">
                                    ₹
                                    {normalizeCurrency({
                                        value: mentor_data.per_month_fee,
                                        currency: "INR",
                                    })}
                                </span>
                                /month
                            </p>
                            <div className="h-4"></div>
                            <AlertDialog open={dialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className="w-full text-xs md:text-sm"
                                        onClick={() => setDialogOpen(true)}
                                    >
                                        Book Trial for ₹
                                        {normalizeCurrency({
                                            value: mentor_data.trial_fee,
                                            currency: "INR",
                                        })}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader className="items-center">
                                        <AlertDialogTitle>
                                            Confirm trial booking with{" "}
                                            {mentor_data.full_name}?
                                        </AlertDialogTitle>
                                        {/* <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete your account
                                            and remove your data from our
                                            servers.
                                        </AlertDialogDescription> */}
                                    </AlertDialogHeader>
                                    <AlertDialogFooter
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {loading ? (
                                            <Loader />
                                        ) : (
                                            <>
                                                <AlertDialogCancel
                                                    disabled={loading}
                                                    onClick={() => setDialogOpen(false)}
                                                >
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        mentor_data.onClick
                                                            ? mentor_data.onClick()
                                                            : bookTrial();
                                                    }}
                                                    disabled={loading}
                                                    className="bg-black hover:bg-black"
                                                >
                                                    Book
                                                </AlertDialogAction>
                                            </>
                                        )}
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    {mentor_data.job_experiences ? (
                        <div className="hidden lg:flex space-x-2 mt-6 overflow-x-auto">
                            {mentor_data.job_experiences?.map((job) => (
                                <Card className="flex-none w-44 px-3 py-2">
                                    <p className="text-xs font-bold">
                                        {job.position.length > 20
                                            ? job.position.substring(0, 20) +
                                              "..."
                                            : job.position}
                                    </p>
                                    <p className="text-xs mt-1">
                                        {job.organization_name.length > 24
                                            ? job.organization_name.substring(
                                                  0,
                                                  24
                                              ) + "..."
                                            : job.organization_name}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    ) : null}
                    <div className="hidden md:block mt-6">
                        <p className="font-semibold">About:</p>
                        <p style={{ fontSize: 13 }} className="text-gray-500">
                            {mentor_data.about}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
