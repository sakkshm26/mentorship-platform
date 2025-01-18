"use client";
import { MultiSelect } from "@/components/dropdowns/Multiselect";
import { MultiSelectSpace } from "@/components/dropdowns/MutlselectSpace";
import { Button } from "@/components/ui/button";
import { COMPANY_MARQUEE, DOMAINS } from "@/constants";
import { customFBEvent } from "@/lib/fbp";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import MentorsVerticalAnimation from "../mentorsVerticalAnimation";
import CompanyCarousel from "../companyCarousel";
import Marquee from "react-fast-marquee";
import * as pixel from "@/lib/fbp";

const Section1 = ({
    selectedDomains,
    setSelectedDomains,
    userData,
    setFormOpen,
}: {
    selectedDomains: any;
    setSelectedDomains: any;
    userData: any;
    setFormOpen: any;
}) => {
    const router = useRouter();
    const [buttonLoading, setButtonLoading] = useState(false);

    return (
        <div>
            <div className="hero-section relative flex flex-col lg:flex-row items-center justify-between gap-20 pt-10 sm:pt-28 sm:px-3 lg:px-16 xl:px-32 sm:bg-[#fdfbfd] sm:pb-28">
                <div className="w-[100%] lg:w-[50%] space-y-6">
                    <h1 className="text-[28px] md:text-[40px] font-semibold leading-[35px] text-wrap md:leading-[50px] lg:w-[33rem] text-center lg:text-left">
                        Learn <span className="text-[#21695C]">coding</span> 4x
                        faster
                        <br />
                        with personal mentor
                    </h1>
                    <h2 className="lg:w-[23rem] text-wrap text-[16px] leading-[25px] text-center lg:text-left px-6 font-light sm:px-0">
                        Land your dream job and kickstart your career with
                        1-on-1 long term mentorship.
                    </h2>
                    {/* <div className="flex sm:hidden items-center justify-between relative h-[450px] phone-mentor-animation">
                        <img
                            src="/turtle/phone.png"
                            className="w-[200px] h-[360px] phone-image"
                            alt="Phone"
                        />
                        <div className="absolute right-0 h-[100%]">
                            <MentorsVerticalAnimation />
                        </div>
                    </div> */}
                    <div className="flex flex-col items-center sm:items-start lg:flex-row lg:w-[28rem] lg:mt-[40px!important] search-select">
                        <div className="w-[90%] sm:w-full text-center">
                            <div className="lg:hidden">
                                <MultiSelectSpace
                                    options={[
                                        ...DOMAINS,
                                        { label: "DSA", value: "dsa" },
                                        { label: "Java", value: "java" },
                                        {
                                            label: "Python",
                                            value: "python",
                                        },
                                        {
                                            label: "React JS",
                                            value: "react_js",
                                        },
                                    ].sort()}
                                    selectedValues={selectedDomains}
                                    setSelectedValues={setSelectedDomains}
                                />
                            </div>
                            <div className="hidden lg:block">
                                <MultiSelect
                                    search={true}
                                    options={[
                                        ...DOMAINS,
                                        { label: "DSA", value: "dsa" },
                                        { label: "Java", value: "java" },
                                        {
                                            label: "Python",
                                            value: "python",
                                        },
                                        {
                                            label: "React JS",
                                            value: "react_js",
                                        },
                                    ].sort()}
                                    selectedValues={selectedDomains}
                                    setSelectedValues={setSelectedDomains}
                                />
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            disabled={buttonLoading}
                            className="w-[90%] lg:ml-2 sm:w-full lg:w-[12rem] rounded-[8px] h-[38px] mt-0.5 sm:mt-0"
                            onClick={async () => {
                                setButtonLoading(true);
                                const event_id = Date.now();
                                customFBEvent(
                                    "find_mentor_cta",
                                    {
                                        location: "hero_section",
                                    },
                                    event_id.toString()
                                );
                                await pixel.sendFBConversionEvent({
                                    isLoggedIn: userData ? true : false,
                                    event_name: "find_mentor_cta",
                                    event_id,
                                });
                                if (
                                    process.env.NEXT_PUBLIC_NODE_ENV !== "dev"
                                ) {
                                    mixpanel.track("find_mentor_cta", {
                                        location: "hero_section",
                                    });
                                }
                                userData
                                    ? router.push("/mentee/mentor-list")
                                    : setFormOpen(true);
                                setButtonLoading(false);
                            }}
                        >
                            Find My Mentor
                        </Button>
                    </div>
                </div>
                <div className="w-[90%] lg:w-[50%] flex items-center justify-between lg:pl-10 relative mt-[-30px] sm:mt-[-40px] lg:mt-[-80px] h-[450px] lg:h-[550px] phone-mentor-animation">
                    <img
                        src="/turtle/phone_white.png"
                        className="w-[200px] h-[380px] sm:h-[370px] phone-image"
                        alt="Phone"
                    />
                    <div className="absolute right-0 h-[83%] sm:h-[65%] mentor-vertical-animation-wrapper">
                        <MentorsVerticalAnimation />
                    </div>
                </div>
            </div>
            <div className="sm:mt-12 mentor-companies">
                <p className="text-[#7b7f93] text-base font-medium text-center">
                    OUR MENTORS ARE FROM
                </p>
                <div className="hidden md:block md:h-[9rem]">
                    <CompanyCarousel />
                </div>
                <div className="block md:hidden">
                    <Marquee speed={100} className="mt-8 sm:mt-14">
                        <div className="mr-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-2">
                            {COMPANY_MARQUEE.map((itm, i) => (
                                <img
                                    key={i}
                                    className={`mx-4 ${
                                        itm.name === "amazon" ? "mt-2" : ""
                                    }`}
                                    style={{
                                        height: itm.phone_height,
                                        width: itm.phone_width,
                                    }}
                                    src={`/turtle/company_logos/${itm.name}.svg`}
                                    alt={itm.name}
                                />
                            ))}
                        </div>
                    </Marquee>
                </div>
            </div>
        </div>
    );
};

export default Section1;
