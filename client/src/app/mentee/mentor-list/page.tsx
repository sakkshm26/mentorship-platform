"use client";
import { MentorCard, MentorCardProps } from "@/components/MentorCard";
import { Navbar, UserDataProps } from "@/components/Navbar";
import { Slider } from "@/components/Slider";
import { MultiSelect } from "@/components/dropdowns/Multiselect";
import Loader from "@/components/loader";
import AuthContext from "@/contexts/auth-context";
import api_client from "@/utils/axios";
import MenteeProtectedRoute from "@/utils/menteeProtectedRoute";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import {
    DOMAINS,
    DOMAIN_VALUE_TO_NAME_MAP,
    SKILLS,
    SKILL_VALUE_TO_NAME_MAP,
} from "@/constants";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "react-infinite-scroll-component";
import { denormalizeCurrency } from "@/utils/common";
import { useSearchParams } from "next/navigation";
import ListMentorCard from "@/components/new-website/listMentorCard";
import Footer from "@/components/new-website/footer";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { debounce } from "lodash";
import { FaAngleDown } from "react-icons/fa6";
import { InputWithIcon } from "@/components/new-website/inputWithIcon";
import { IoIosSearch } from "react-icons/io";
import NewLoader from "@/components/NewLoader";

const MentorListDashboard = () => {
    const user_context = useContext(AuthContext);
    const searchParams = useSearchParams();
    /* const [selectedSkills, setSelectedSkills] = useState<
        Record<"value" | "label", string>[]
    >([]); */
    const [selectedDomains, setSelectedDomains] = useState<
        Record<string, boolean>
    >(
        searchParams
            .get("domains")
            ?.split(",")
            .reduce((acc: any, curr: any) => {
                acc[curr] = true;
                return acc;
            }, {}) || {}
    );
    const [selectedSkills, setSelectedSkills] = useState<
        Record<string, boolean>
    >(
        searchParams
            .get("skills")
            ?.split(",")
            .reduce((acc: any, curr: any) => {
                acc[curr] = true;
                return acc;
            }, {}) || {}
    );
    const [experience, setExperience] = useState([1, 15]);
    // const [trialPricing, setTrialPricing] = useState([0, 2000]);
    const [perMonthPricing, setPerMonthPricing] = useState([
        parseInt(searchParams.get("monthly_budget_min") || "3000"),
        parseInt(searchParams.get("monthly_budget_max") || "20000"),
    ]);
    const [mentorsList, setMentorsList] = useState<MentorCardProps[]>([]);
    const [mentorsLoading, setMentorsLoading] = useState(true);
    const [userData, setUserData] = useState<UserDataProps>();
    const [queryOffset, setQueryOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [jobOrSkillSearch, setJobOrSkillSearch] = useState("");
    const isInitialMount = useRef(true);

    const getUser = async () => {
        try {
            /* const response = await api_client.get(
                `/internal/user/${user_context.session?.user.user_metadata.user_id}`
            ); */
            const response = await api_client.get(
                `/internal/user/${user_context.session?.user_id}`
            );
            setUserData(response.data);
        } catch (error) {
            toast("Something went wrong", { type: "error" });
        }
    };

    const getMentors = async (DTO: {
        skills?: string;
        domains?: string;
        experience_min?: number;
        experience_max?: number;
        trial_fee_min?: number;
        trial_fee_max?: number;
        per_month_fee_min?: number;
        per_month_fee_max?: number;
        job_or_skill_search?: string;
        offset?: number;
    }) => {
        try {
            const {
                skills,
                domains,
                experience_min,
                experience_max,
                trial_fee_min,
                trial_fee_max,
                per_month_fee_min,
                per_month_fee_max,
                job_or_skill_search,
                offset,
            } = DTO;
            const response = await api_client.get("/internal/mentor", {
                params: {
                    job_or_skill_search,
                    skills,
                    domains,
                    experience_min,
                    experience_max,
                    trial_fee_min: trial_fee_min
                        ? denormalizeCurrency({
                              value: trial_fee_min,
                              currency: "INR",
                          })
                        : undefined,
                    trial_fee_max: trial_fee_max
                        ? denormalizeCurrency({
                              value: trial_fee_max,
                              currency: "INR",
                          })
                        : undefined,
                    per_month_fee_min: per_month_fee_min
                        ? denormalizeCurrency({
                              value: per_month_fee_min,
                              currency: "INR",
                          })
                        : undefined,
                    per_month_fee_max: per_month_fee_max
                        ? denormalizeCurrency({
                              value: per_month_fee_max,
                              currency: "INR",
                          })
                        : undefined,
                    offset,
                },
            });
            if (response.data.length < 10) {
                setHasMore(false);
            }
            if (offset) {
                setMentorsList((prev) => [...prev, ...response.data]);
            } else {
                setMentorsList(response.data);
                setMentorsLoading(false);
            }
        } catch (error) {
            toast("Something went wrong", { type: "error" });
        }
    };

    const handleSearch = async (
        offset?: number,
        job_or_skill_search?: string
    ) => {
        if (!offset) {
            setMentorsLoading(true);
        }
        const formattedDomains = Object.keys(selectedDomains).filter(
            (domain) => selectedDomains[domain]
        );
        const formattedSkills = Object.keys(selectedSkills).filter(
            (skill) => selectedSkills[skill]
        );
        getMentors({
            skills: formattedSkills.join(","),
            domains: formattedDomains.join(","),
            experience_min: experience[0],
            experience_max: experience[1],
            // trial_fee_min: trialPricing[0],
            // trial_fee_max: trialPricing[1],
            per_month_fee_min: perMonthPricing[0],
            per_month_fee_max: perMonthPricing[1],
            offset,
            job_or_skill_search,
        });
    };

    useEffect(() => {
        const formattedDomains = Object.keys(selectedDomains).filter(
            (domain) => selectedDomains[domain]
        );
        const formattedSkills = Object.keys(selectedSkills).filter(
            (skill) => selectedSkills[skill]
        );
        getMentors({
            skills: formattedSkills.join(","),
            domains: formattedDomains.join(","),
            experience_min: experience[0],
            experience_max: experience[1],
            per_month_fee_min: perMonthPricing[0],
            per_month_fee_max: perMonthPricing[1],
        });
    }, [selectedSkills, selectedDomains]);

    useEffect(() => {
        getUser();
    }, []);

    const debouncedSearch = useCallback(
        debounce((term: string) => {
            handleSearch(undefined, term);
        }, 700),
        []
    );

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        } else {
            debouncedSearch(jobOrSkillSearch);
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [jobOrSkillSearch, debouncedSearch]);

    // return !user_context.session?.user.user_metadata.mentee_id ||
    return (
        <section>
            <div className="flex flex-col justify-between px-3 md:px-[5%] lg:px-[15%]">
                <Navbar
                    id={userData?.id}
                    email={userData?.email}
                    phone={userData?.phone}
                    full_name={userData?.full_name}
                />
                <p className="hidden md:flex flex-row items-left text-3xl font-semibold mt-20">
                    <span className="mentor-list-text-gradient">
                        Book an intro session{" "}
                    </span>{" "}
                    &nbsp;with a mentor of your choice
                </p>
                <p className="block md:hidden text-3xl font-semibold mt-20 leading-[45px]">
                    <span className="mentor-list-text-gradient">
                        Book an intro session{" "}
                    </span>{" "}
                    <br /> with a mentor of your choice
                </p>
                <div className="flex flex-col md:flex-row justify-between mt-10 md:mt-16 mb-6">
                    <InputWithIcon
                        placeholder="Search by skill or job title"
                        className="md:w-[20rem]"
                        startIcon={
                            <IoIosSearch className="h-4 w-4 text-muted-foreground" />
                        }
                        value={jobOrSkillSearch}
                        onChange={(e) => setJobOrSkillSearch(e.target.value)}
                    />
                    <div className="flex flex-col sm:flex-row mt-5 md:mt-0">
                        <div className="flex space-x-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-xs md:text-sm rounded-3xl flex space-x-1.5"
                                    >
                                        <p>Skill</p>
                                        <FaAngleDown className="text-[#21695C]" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 h-40 overflow-y-scroll">
                                    {[
                                        ...Object.keys(selectedSkills)
                                            .filter(
                                                (skill) => selectedSkills[skill]
                                            )
                                            .map((skill) => ({
                                                label: SKILL_VALUE_TO_NAME_MAP[
                                                    skill
                                                ],
                                                value: skill,
                                            })),
                                        ...SKILLS.filter(
                                            (skill) =>
                                                !selectedSkills[skill.value]
                                        ),
                                    ].map((skill, index) => (
                                        <DropdownMenuCheckboxItem
                                            key={index}
                                            checked={
                                                selectedSkills[skill.value]
                                            }
                                            onCheckedChange={(value) =>
                                                setSelectedSkills((prev) => ({
                                                    ...prev,
                                                    [skill.value]: value,
                                                }))
                                            }
                                        >
                                            {skill.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-xs md:text-sm rounded-3xl flex space-x-1.5"
                                    >
                                        <p>Domain</p>
                                        <FaAngleDown className="text-[#21695C]" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 h-40 overflow-y-scroll">
                                    {[
                                        ...Object.keys(selectedDomains)
                                            .filter(
                                                (domain) =>
                                                    selectedDomains[domain]
                                            )
                                            .map((domain) => ({
                                                label: DOMAIN_VALUE_TO_NAME_MAP[
                                                    domain
                                                ],
                                                value: domain,
                                            })),
                                        ...DOMAINS.filter(
                                            (domain) =>
                                                !selectedDomains[domain.value]
                                        ),
                                    ].map((domain, index) => (
                                        <DropdownMenuCheckboxItem
                                            key={index}
                                            checked={
                                                selectedDomains[domain.value]
                                            }
                                            onCheckedChange={(value) =>
                                                setSelectedDomains((prev) => ({
                                                    ...prev,
                                                    [domain.value]: value,
                                                }))
                                            }
                                        >
                                            {domain.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex space-x-3 sm:ml-3 mt-2 sm:mt-0">
                            <DropdownMenu
                                onOpenChange={(value) => {
                                    if (!value) {
                                        handleSearch();
                                    }
                                }}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-xs md:text-sm rounded-3xl flex space-x-1.5"
                                    >
                                        <p>Pricing</p>
                                        <FaAngleDown className="text-[#21695C]" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72">
                                    <div className="p-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">
                                                ₹{perMonthPricing[0]}{" "}
                                                <span className="text-xs">
                                                    /month
                                                </span>
                                            </p>
                                            <p className="text-sm font-medium">
                                                ₹{perMonthPricing[1]}{" "}
                                                <span className="text-xs">
                                                    /month
                                                </span>
                                            </p>
                                        </div>
                                        <Slider
                                            minStepsBetweenThumbs={1}
                                            step={1000}
                                            min={3000}
                                            max={20000}
                                            defaultValue={perMonthPricing}
                                            onValueChange={setPerMonthPricing}
                                            className={cn("mt-5")}
                                        />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu
                                onOpenChange={(value) => {
                                    if (!value) {
                                        handleSearch();
                                    }
                                }}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-xs md:text-sm rounded-3xl flex space-x-1.5"
                                    >
                                        <p>Experience</p>
                                        <FaAngleDown className="text-[#21695C]" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72">
                                    <div className="p-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">
                                                {experience[0]}{" "}
                                                {experience[0] === 1
                                                    ? "year"
                                                    : "years"}
                                            </p>
                                            <p className="text-sm font-medium">
                                                {experience[1]} years
                                            </p>
                                        </div>
                                        <Slider
                                            minStepsBetweenThumbs={1}
                                            step={1}
                                            min={1}
                                            max={15}
                                            defaultValue={experience}
                                            onValueChange={setExperience}
                                            className={cn("mt-5")}
                                        />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                {!user_context.session?.mentee_id ||
                mentorsLoading ||
                !userData ? (
                    <div className="flex justify-center items-center">
                        <NewLoader className="py-40" />
                    </div>
                ) : (
                    <div className="mt-10 md:mt-14">
                        {mentorsList.length ? (
                            <div className="flex flex-col">
                                <InfiniteScroll
                                    dataLength={mentorsList.length}
                                    next={() => {
                                        setQueryOffset(queryOffset + 10);
                                        handleSearch(queryOffset + 10);
                                    }}
                                    hasMore={hasMore}
                                    loader={
                                        <NewLoader className="mt-[6rem] mb-[4rem] flex justify-center" />
                                    }
                                >
                                    {mentorsList.map(
                                        (mentor: MentorCardProps, index) =>
                                            index === 0 ? (
                                                <div>
                                                    <ListMentorCard
                                                        key={mentor.id}
                                                        id={mentor.id}
                                                        heading={mentor.heading}
                                                        about={mentor.about}
                                                        trial_fee={
                                                            mentor.trial_fee
                                                        }
                                                        per_month_fee={
                                                            mentor.per_month_fee
                                                        }
                                                        profile_image_url={
                                                            mentor.profile_image_url
                                                        }
                                                        linkedin_url={
                                                            mentor.linkedin_url
                                                        }
                                                        skills={mentor.skills}
                                                        full_name={
                                                            mentor.full_name
                                                        }
                                                        years_experience={
                                                            mentor.years_experience
                                                        }
                                                        job_experiences={
                                                            mentor.job_experiences
                                                        }
                                                        session_count={
                                                            mentor.session_count
                                                        }
                                                        external_rating={
                                                            mentor.external_rating
                                                        }
                                                    />
                                                    <img
                                                        src="/turtle/free_intro.png"
                                                        className="mb-14 hidden sm:block"
                                                        alt="turtle_intro"
                                                    />
                                                </div>
                                            ) : (
                                                <ListMentorCard
                                                    key={mentor.id}
                                                    id={mentor.id}
                                                    heading={mentor.heading}
                                                    about={mentor.about}
                                                    trial_fee={mentor.trial_fee}
                                                    per_month_fee={
                                                        mentor.per_month_fee
                                                    }
                                                    profile_image_url={
                                                        mentor.profile_image_url
                                                    }
                                                    linkedin_url={
                                                        mentor.linkedin_url
                                                    }
                                                    skills={mentor.skills}
                                                    full_name={mentor.full_name}
                                                    years_experience={
                                                        mentor.years_experience
                                                    }
                                                    job_experiences={
                                                        mentor.job_experiences
                                                    }
                                                    session_count={
                                                        mentor.session_count
                                                    }
                                                    external_rating={
                                                        mentor.external_rating
                                                    }
                                                />
                                            )
                                    )}
                                </InfiniteScroll>
                            </div>
                        ) : (
                            <p className="text-center font-semibold mt-5">
                                No mentors found with the selected filters
                            </p>
                        )}
                    </div>
                )}
            </div>
            <hr className="w-full mt-8" />
            <div className="flex flex-col-reverse items-center lg:flex-row justify-between px-3 lg:px-[10%] mt-16 lg:mt-28">
                <div className="lg:w-[40%]">
                    <p className="text-3xl font-bold mt-14 lg:mt-0">
                        Turtle membership <br /> includes:
                    </p>
                    <div className="flex mt-6">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            Minimum 4 sessions a month for around 60 mins each
                        </p>
                    </div>
                    <div className="flex mt-5">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            24/7 chat assistance with mentor to ask doubts
                        </p>
                    </div>
                    <div className="flex mt-5">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            Unused sessions are rolled over to the next month
                        </p>
                    </div>
                    <div className="flex mt-5">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            Weekly check-in by the mentor to track progress
                        </p>
                    </div>
                    <div className="flex mt-5">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            Access to session recording to revise concepts
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="border-[#21695C] text-[#21695C] w-full mt-8 font-semibold"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                    >
                        Book A Session
                    </Button>
                </div>
                <img
                    src="/turtle/video_meet.svg"
                    className="lg:w-[48%] h-auto w-[30rem]"
                    alt="video_meet"
                />
            </div>
            <Footer />
        </section>
    );
};

export default MenteeProtectedRoute(MentorListDashboard);
