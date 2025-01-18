import Loader from "@/components/loader";
import api_client from "@/utils/axios";
import React, { useEffect, useRef, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import MentorCarousel from "../mentorCarousel";
import NewLoader from "@/components/NewLoader";

interface MentorType {
    id: string;
    full_name: string;
    profile_image_url: string;
    skills: string[];
    organizations: string[];
    years_experience: number;
    about: string;
    heading: string;
    per_month_fee: number;
    trial_fee: number;
    job_experiences: Array<any>;
}

const MentorsFilter = ({ setFormOpenFromCard }: { setFormOpenFromCard: any }) => {
    const [mentors, setMentors] = useState<Record<string, any[]>>({});
    const [activeMentors, setActiveMentors] = useState<MentorType[]>([]);
    const [mentorsLoading, setMentorsLoading] = useState(true);
    const [activeDomain, setActiveDomain] = useState("all");
    const mentorsRef = useRef(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /* useEffect(() => {
        const runEveryFourSeconds = () => {
            (mentorsRef as any)?.current?.scrollBy({
                left: 305,
                behavior: "smooth",
            });
        };

        const setUpTimeout = () => {
            timerRef.current = setTimeout(() => {
                runEveryFourSeconds();
                setUpTimeout();
            }, 4000);
        };

        setUpTimeout();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []); */

    const getMentors = async () => {
        try {
            const response = await api_client.get("/open/static-mentors");
            setMentors(response.data);
            setActiveMentors(response.data.all);
            setMentorsLoading(false);
        } catch (err) {}
    };

    const changeMentorDomain = async (domain_or_skill: string) => {
        setActiveDomain(domain_or_skill);
        setActiveMentors(mentors[domain_or_skill]);
    };

    useEffect(() => {
        getMentors();
    }, []);

    return (
        <div
            className="flex flex-col w-full mt-14 sm:mt-36 px-3 sm:px-32"
            id="our-mentors"
        >
            <p className="hidden sm:block text-4xl font-semibold mb-0">
                500+ Mentors Just a <br /> Session Away
            </p>
            <p className="sm:hidden text-3xl font-bold mb-0">
                500+ Mentors Just a <br /> Session Away
            </p>
            <p className="mt-4 md:mt-5 text-sm font-light">
                1-1 sessions with engineers from the world's top tech companies.
            </p>
            <div className="mt-3 md:mt-8">
                <div className="flex justify-between items-center">
                    <div className="flex overflow-x-scroll whitespace-nowrap max-w-48 md:max-w-full">
                        <p
                            className={`font-medium text-xs md:text-sm cursor-pointer p-3 md:p-4 mb-0 ${
                                activeDomain === "all"
                                    ? "text-black font-semibold "
                                    : "text-gray-400"
                            }`}
                            onClick={() => changeMentorDomain("all")}
                        >
                            All
                        </p>
                        <p
                            className={`font-medium text-xs md:text-sm cursor-pointer p-3 md:p-4 mb-0 ${
                                activeDomain === "dsa"
                                    ? "text-black font-semibold "
                                    : "text-gray-400"
                            }`}
                            onClick={() => changeMentorDomain("dsa")}
                        >
                            DSA
                        </p>
                        <p
                            className={`font-medium text-xs md:text-sm cursor-pointer p-3 md:p-4 mb-0 ${
                                activeDomain === "data_science"
                                    ? "text-black font-semibold "
                                    : "text-gray-400"
                            }`}
                            onClick={() => changeMentorDomain("data_science")}
                        >
                            Data Science
                        </p>
                        <p
                            className={`font-medium text-xs md:text-sm cursor-pointer p-3 md:p-4 mb-0 ${
                                activeDomain === "ai"
                                    ? "text-black font-semibold "
                                    : "text-gray-400"
                            }`}
                            onClick={() => changeMentorDomain("ai")}
                        >
                            AI
                        </p>
                        <p
                            className={`font-medium text-xs md:text-sm cursor-pointer p-3 md:p-4 mb-0 ${
                                activeDomain === "devops"
                                    ? "text-black font-semibold "
                                    : "text-gray-400"
                            }`}
                            onClick={() => changeMentorDomain("devops")}
                        >
                            DevOps
                        </p>
                    </div>
                    <div className="flex">
                        <GoArrowLeft
                            // size={40}
                            className="mr-5 h-[35px] md:h-[40px] w-[35px] md:w-[40px] border-2 border-gray-100 rounded-full p-[9px] cursor-pointer"
                            onClick={() =>
                                (mentorsRef as any)?.current?.scrollBy({
                                    left: -305,
                                    behavior: "smooth",
                                })
                            }
                        />
                        <GoArrowRight
                            className="h-[35px] md:h-[40px] w-[35px] md:w-[40px] border-2 border-gray-100 rounded-full p-[9px] cursor-pointer"
                            onClick={() =>
                                (mentorsRef as any)?.current?.scrollBy({
                                    left: 305,
                                    behavior: "smooth",
                                })
                            }
                        />
                    </div>
                </div>
                {mentorsLoading ? (
                    <div className="flex justify-center items-center my-44">
                        <NewLoader />
                    </div>
                ) : (
                    <MentorCarousel
                        mentors={activeMentors}
                        mentorsRef={mentorsRef}
                        setFormOpenFromCard={setFormOpenFromCard}
                    />
                )}
            </div>
        </div>
    );
};

export default MentorsFilter;
