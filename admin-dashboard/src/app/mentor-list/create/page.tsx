/* "use client";
import { MentorCard, MentorCardProps } from "@/components/MentorCard";
import { Slider } from "@/components/Slider";
import { MultiSelect } from "@/components/dropdowns/Multiselect";
import Loader from "@/components/loader";
import AuthContext from "@/contexts/auth-context";
import api_client from "@/utils/axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DOMAINS, SKILLS } from "@/constants";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "react-infinite-scroll-component";
import ProtectedRoute from "@/utils/protectedRoute";
import { Input } from "@/components/ui/input";

const CreateMentorList = () => {
    const user_context = useContext(AuthContext);
    const [selectedSkills, setSelectedSkills] = useState<
        Record<"value" | "label", string>[]
    >([]);
    const [selectedDomains, setSelectedDomains] = useState<
        Record<"value" | "label", string>[]
    >([]);
    const [experience, setExperience] = useState([0, 15]);
    const [trialPricing, setTrialPricing] = useState([0, 2000]);
    const [perMonthPricing, setPerMonthPricing] = useState([2000, 20000]);
    const [mentorsList, setMentorsList] = useState<MentorCardProps[]>([]);
    const [mentorsLoading, setMentorsLoading] = useState(true);
    const [queryOffset, setQueryOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [mentorsToAdd, setMentorsToAdd] = useState<Record<string, boolean>>(
        {}
    ); // mentors to add in the list being created
    const [listName, setListName] = useState("");

    const getMentors = async (DTO: {
        skills?: string;
        domains?: string;
        experience_min?: number;
        experience_max?: number;
        trial_fee_min?: number;
        trial_fee_max?: number;
        per_month_fee_min?: number;
        per_month_fee_max?: number;
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
                offset,
            } = DTO;
            const response = await api_client.get("/admin/mentor", {
                params: {
                    skills,
                    domains,
                    experience_min,
                    experience_max,
                    trial_fee_min,
                    trial_fee_max,
                    per_month_fee_min,
                    per_month_fee_max,
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

    const handleSearch = async (offset?: number) => {
        if (!offset) {
            setMentorsLoading(true);
        }
        getMentors({
            skills: selectedSkills.map((skill) => skill.value).join(","),
            domains: selectedDomains.map((domain) => domain.value).join(","),
            experience_min: experience[0],
            experience_max: experience[1],
            trial_fee_min: trialPricing[0],
            trial_fee_max: trialPricing[1],
            per_month_fee_min: perMonthPricing[0],
            per_month_fee_max: perMonthPricing[1],
            offset,
        });
    };

    const createList = async (e: any) => {
        e.preventDefault();
        try {
            const mentor_ids = [];
            for (const [key, value] of Object.entries(mentorsToAdd)) {
                if (value) {
                    mentor_ids.push(key);
                }
            }
            const response = await api_client.post(
                "/admin/session-mentor-list",
                {
                    mentor_ids,
                    name: listName,
                }
            );
            toast(
                <button onClick={() => {
                    navigator.clipboard.writeText(`https://getboldd.com/session-mentor-list/${response.data.session}`)
                }}>
                    Click here to copy the shareable link
                </button>,
                { type: "success", autoClose: false }
            );
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    useEffect(() => {
        getMentors({});
    }, []);

    // return !user_context.session?.user.user_metadata.mentee_id ||
    return !user_context.api_key || mentorsLoading ? (
        <Loader global={true} />
    ) : (
        <section>
            <form
                onSubmit={createList}
                className="mt-12 mb-20 flex flex-col justify-center items-center"
            >
                <Input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter the list name"
                    className="w-11/12 md:w-2/5"
                    onChange={(e) => setListName(e.target.value)}
                />
                <Button type="submit" className="mt-4">
                    Create List
                </Button>
            </form>
            <div className="flex justify-center items-center mt-4 md:mt-8">
                <Dialog
                    onOpenChange={(val) => {
                        if (!val) {
                            setQueryOffset(0);
                            setHasMore(true);
                            handleSearch();
                        }
                    }}
                >
                    <DialogTrigger>
                        <Button className="text-xs md:text-sm w-20 h-9">
                            Filters
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold">
                                Experience (in years)
                            </label>
                            <div className="h-2"></div>
                            <Slider
                                minStepsBetweenThumbs={1}
                                step={1}
                                min={0}
                                max={15}
                                defaultValue={experience}
                                onValueChange={setExperience}
                                className={cn("w-3/4")}
                            />
                            <div className="h-1"></div>
                            <div className="flex justify-between items-center w-3/4">
                                <p className="text-xs font-semibold">
                                    {experience[0]}
                                </p>
                                <p className="text-xs font-semibold">
                                    {experience[1]}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold">
                                Trial Pricing
                            </label>
                            <div className="h-2"></div>
                            <Slider
                                minStepsBetweenThumbs={1}
                                step={100}
                                min={0}
                                max={2000}
                                defaultValue={trialPricing}
                                onValueChange={setTrialPricing}
                                className={cn("w-3/4")}
                            />
                            <div className="h-2"></div>
                            <div className="flex justify-between items-center w-3/4">
                                <p className="text-xs font-semibold">
                                    ₹{trialPricing[0]}
                                </p>
                                <p className="text-xs font-semibold">
                                    ₹{trialPricing[1]}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold">
                                Per Month Pricing
                            </label>
                            <div className="h-2"></div>
                            <Slider
                                minStepsBetweenThumbs={1}
                                step={1000}
                                min={2000}
                                max={20000}
                                defaultValue={perMonthPricing}
                                onValueChange={setPerMonthPricing}
                                className={cn("w-3/4")}
                            />
                            <div className="h-2"></div>
                            <div className="flex justify-between items-center w-3/4">
                                <p className="text-xs font-semibold">
                                    ₹{perMonthPricing[0]}
                                </p>
                                <p className="text-xs font-semibold">
                                    ₹{perMonthPricing[1]}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold">
                                Domains
                            </label>
                            <div className="py-1"></div>
                            <div className="w-3/4">
                                <MultiSelect
                                    options={DOMAINS}
                                    selectedValues={selectedDomains}
                                    setSelectedValues={setSelectedDomains}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold">
                                Skills
                            </label>
                            <div className="py-1"></div>
                            <div className="w-3/4">
                                <MultiSelect
                                    options={SKILLS}
                                    selectedValues={selectedSkills}
                                    setSelectedValues={setSelectedSkills}
                                />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-4 md:mt-8">
                {mentorsList.length ? (
                    <div className="flex flex-col items-center">
                        <InfiniteScroll
                            dataLength={mentorsList.length}
                            next={() => {
                                setQueryOffset(queryOffset + 10);
                                handleSearch(queryOffset + 10);
                            }}
                            hasMore={hasMore}
                            loader={<Loader className="mt-6" />}
                        >
                            {mentorsList.map((mentor: MentorCardProps) => (
                                <MentorCard
                                    active={mentorsToAdd[mentor.id]}
                                    onClick={() => {
                                        setMentorsToAdd((prev) => ({
                                            ...prev,
                                            [mentor.id]: !prev[mentor.id],
                                        }));
                                    }}
                                    key={mentor.id}
                                    id={mentor.id}
                                    heading={mentor.heading}
                                    about={mentor.about}
                                    trial_fee={mentor.trial_fee}
                                    per_month_fee={mentor.per_month_fee}
                                    profile_image_url={mentor.profile_image_url}
                                    skills={mentor.skills}
                                    full_name={mentor.full_name}
                                    years_experience={mentor.years_experience}
                                />
                            ))}
                        </InfiniteScroll>
                    </div>
                ) : (
                    <p className="text-center font-semibold mt-5">
                        No mentors found with the selected filters
                    </p>
                )}
            </div>
            <div className="h-8"></div>
        </section>
    );
};

export default ProtectedRoute(CreateMentorList);
 */

"use client";
import { MentorCard, MentorCardProps } from "@/components/MentorCard";
import { Slider } from "@/components/Slider";
import AuthContext from "@/contexts/auth-context";
import api_client from "@/utils/axios";
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
import ListMentorCard from "@/components/listMentorCard";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { debounce } from "lodash";
import { FaAngleDown } from "react-icons/fa6";
import { InputWithIcon } from "@/components/inputWithIcon";
import { IoIosSearch } from "react-icons/io";
import ProtectedRoute from "@/utils/protectedRoute";
import Loader from "@/components/loader";

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
    const [queryOffset, setQueryOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [jobOrSkillSearch, setJobOrSkillSearch] = useState("");
    const isInitialMount = useRef(true);
    const [mentorsToAdd, setMentorsToAdd] = useState<Record<string, boolean>>(
        {}
    ); // mentors to add in the list being created
    const [listName, setListName] = useState("");

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
            const response = await api_client.get("/admin/mentor", {
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

    const createList = async (e: any) => {
        e.preventDefault();
        try {
            const mentor_ids = [];
            for (const [key, value] of Object.entries(mentorsToAdd)) {
                if (value) {
                    mentor_ids.push(key);
                }
            }
            const response = await api_client.post(
                "/admin/session-mentor-list",
                {
                    mentor_ids,
                    name: listName,
                }
            );
            toast(
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `https://turtlex.in/session-mentor-list/${response.data.nano_id}`
                        );
                    }}
                >
                    Click here to copy the shareable link
                </button>,
                { type: "success", autoClose: false }
            );
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
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

    return !user_context.api_key || mentorsLoading ? (
        <Loader global={true} />
    ) : (
        <section>
            <form
                onSubmit={createList}
                className="mt-12 mb-20 flex flex-col justify-center items-center"
            >
                <Input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter the list name"
                    className="w-11/12 md:w-2/5"
                    onChange={(e) => setListName(e.target.value)}
                />
                <Button type="submit" className="mt-4">
                    Create List
                </Button>
            </form>
            <div className="flex flex-col justify-between px-3 md:px-[5%] lg:px-[15%]">
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
                                            onCheckedChange={(value: any) =>
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
                                            onCheckedChange={(value: any) =>
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
                                onOpenChange={(value: any) => {
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
                                onOpenChange={(value: any) => {
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
                                    <Loader className="mt-[6rem] mb-[4rem] flex justify-center" />
                                }
                            >
                                {mentorsList.map(
                                    (mentor: MentorCardProps, index) => (
                                        <ListMentorCard
                                            active={mentorsToAdd[mentor.id]}
                                            onClick={() => {
                                                setMentorsToAdd((prev) => ({
                                                    ...prev,
                                                    [mentor.id]:
                                                        !prev[mentor.id],
                                                }));
                                            }}
                                            key={mentor.id}
                                            id={mentor.id}
                                            heading={mentor.heading}
                                            about={mentor.about}
                                            trial_fee={mentor.trial_fee}
                                            per_month_fee={mentor.per_month_fee}
                                            profile_image_url={
                                                mentor.profile_image_url
                                            }
                                            skills={mentor.skills}
                                            full_name={mentor.full_name}
                                            years_experience={
                                                mentor.years_experience
                                            }
                                            job_experiences={
                                                mentor.job_experiences
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
            </div>
        </section>
    );
};

export default ProtectedRoute(MentorListDashboard);
