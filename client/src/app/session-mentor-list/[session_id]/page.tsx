"use client";
import { MentorCard, MentorCardProps } from "@/components/MentorCard";
import NewLoader from "@/components/NewLoader";
import Loader from "@/components/loader";
import Footer from "@/components/new-website/footer";
import ListMentorCard from "@/components/new-website/listMentorCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

const SessionMentorList = ({ params }: any) => {
    const { session_id } = params;
    const [mentorsList, setMentorsList] = useState<MentorCardProps[]>([]);
    const [mentorsLoading, setMentorsLoading] = useState(true);
    const [queryOffset, setQueryOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [listName, setListName] = useState("");

    const getMentors = async (DTO: { offset?: number }) => {
        try {
            const { offset } = DTO;
            const response = await axios.get(
                session_id.length === 10
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}/open/session-list/${session_id}`
                    : `${process.env.NEXT_PUBLIC_BASE_URL}/internal/mentor/session`,
                {
                    params: {
                        offset,
                    },
                    headers:
                        session_id.length === 10
                            ? undefined
                            : {
                                  Authorization: `Bearer ${session_id}`,
                              },
                }
            );
            setListName(response.data.name);
            if (response.data.mentors.length < 10) {
                setHasMore(false);
            }
            if (offset) {
                setMentorsList((prev) => [...prev, ...response.data.mentors]);
            } else {
                setMentorsList(response.data.mentors);
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
            offset,
        });
    };

    const bookTrial = async (mentor_id: string) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/internal/mentor/session/booking`,
                {
                    mentor_id,
                    session_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session_id}`,
                    },
                }
            );
            toast("Success! Our team will get in touch with you soon.", {
                type: "success",
            });
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    useEffect(() => {
        getMentors({});
    }, []);

    return mentorsLoading ? (
        <NewLoader global={true} />
    ) : (
        <section>
            <div className="flex flex-col justify-between px-3 md:px-[5%] lg:px-[15%]">
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
                {mentorsLoading ? (
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
                                                        session_id={session_id}
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
                                                    session_id={session_id}
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
            </div>
            <Footer />
        </section>
    );
};

export default SessionMentorList;
