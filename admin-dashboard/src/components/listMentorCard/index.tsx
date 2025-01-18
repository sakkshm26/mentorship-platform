import { MentorCardProps } from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    SKILL_VALUE_TO_NAME_MAP,
} from "@/constants";
import api_client from "@/utils/axios";
import { normalizeCurrency } from "@/utils/common";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

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
    const router = useRouter();
    const company_name = mentor_data.job_experiences[0].organization_name
        .toLowerCase()
        .replaceAll(" ", "_");

    return (
        <Card
            className={`w-full mb-14 px-3 md:px-6 py-8 rounded-xl ${mentor_data.active ? "border-2 border-red-600" : ""}`}
            key={mentor_data.id}
            onClick={mentor_data.onClick}
        >
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
                </div>
                <div className="mt-8 sm:mt-0 sm:ml-8">
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
                            <p className="text-[20px] font-semibold mt-1">
                                ₹
                                {normalizeCurrency({
                                    value: mentor_data.per_month_fee,
                                    currency: "INR",
                                })}{" "}
                                <span className="text-[16px]">/ month</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ListMentorCard;
