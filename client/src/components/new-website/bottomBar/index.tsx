"use client";

import { Button } from "@/components/ui/button";
import { customFBEvent } from "@/lib/fbp";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import * as pixel from "@/lib/fbp";
import { useState } from "react";

const BottomBar = ({
    userData,
    setFormOpen,
}: {
    userData: any;
    setFormOpen: any;
}) => {
    const router = useRouter();
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleClick = async () => {
        setButtonLoading(true);
        const event_id = Date.now();
        customFBEvent(
            "find_mentor_cta",
            {
                location: "bottom_bar",
            },
            event_id.toString()
        );
        await pixel.sendFBConversionEvent({
            isLoggedIn: userData ? true : false,
            event_name: "find_mentor_cta",
            event_id,
        });
        if (process.env.NEXT_PUBLIC_NODE_ENV !== "dev") {
            mixpanel.track("find_mentor_cta", {
                location: "bottom_bar",
            });
        }
        userData ? router.push("/mentee/mentor-list") : setFormOpen(true);
        setButtonLoading(false);
    };

    return (
        <div>
            <div
                className="sm:hidden shadow-2xl"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: "20px 15px 25px 15px",
                    backgroundColor: "#16BE45",
                    borderRadius: "2px",
                    alignItems: "center",
                    background: "white",
                    justifyContent: "center",
                }}
            >
                <Button
                    className="border border-[#21695C] w-full py-5 rounded-[8px] text-[#21695C]"
                    disabled={buttonLoading}
                    onClick={handleClick}
                >
                    {/* <FaWhatsapp
                        cursor="pointer"
                        color="#21695C"
                        size={18}
                        className="mr-2"
                    /> */}
                    Find My Mentor
                </Button>
            </div>
            <div
                className="hidden sm:flex shadow-2xl"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: "20px 0px 25px 0px",
                    backgroundColor: "#16BE45",
                    borderRadius: "2px",
                    alignItems: "center",
                    background: "white",
                    justifyContent: "center",
                }}
            >
                <p className="mb-0">
                    Kickstart your career with long term mentorship. Talk to us
                    to learn more!
                </p>
                <Button
                    className="ml-6 border border-[#21695C] w-[160px] py-5 rounded-[8px] text-[#21695C]"
                    disabled={buttonLoading}
                    onClick={handleClick}
                >
                    Find My Mentor
                </Button>
            </div>
        </div>
    );
};

export default BottomBar;
