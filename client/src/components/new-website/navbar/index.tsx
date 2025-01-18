import { customFBEvent } from "@/lib/fbp";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as pixel from "@/lib/fbp";

const Navbar = ({
    userData,
    domains,
    onClick,
    setFormOpen,
}: {
    userData?: any;
    domains?: Record<"value" | "label", string>[];
    onClick?: () => any;
    setFormOpen: any;
}) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > lastScrollY) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar);
            return () => {
                window.removeEventListener("scroll", controlNavbar);
            };
        }
    }, [lastScrollY]);

    return (
        <div
            className={`flex justify-between px-5 md:px-44 py-3.5 sticky top-0 z-30 transition-all duration-300 ${
                lastScrollY === 0 ? "bg-transparent" : "bg-white"
            } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        >
            <img
                src="/turtle/turtle_logo.svg"
                alt="turtle logo"
                className="hidden sm:block w-[125px] cursor-pointer"
                onClick={() => router.push("/")}
            />
            <img
                src="/turtle/turtle_logo_without_text.svg"
                alt="turtle logo"
                className="sm:hidden h-[30px] w-[30px] rounded-md"
            />
            <button
                className="border border-[#21695C] w-[110px] md:w-[160px] py-1.5 md:py-2 rounded-[8px] text-[#21695C] text-xs md:text-base font-normal"
                disabled={buttonLoading}
                onClick={async () => {
                    setButtonLoading(true);
                    const event_id = Date.now();
                    customFBEvent(
                        "find_mentor_cta",
                        {
                            location: "navbar",
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
                            location: "navbar",
                        });
                    }
                    onClick
                        ? onClick()
                        : userData
                        ? router.push("/mentee/mentor-list")
                        : setFormOpen(true);
                    setButtonLoading(false);
                }}
            >
                Find My Mentor
            </button>
        </div>
    );
};

export default Navbar;
