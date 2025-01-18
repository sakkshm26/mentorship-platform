import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const LastSection = ({ userData, setFormOpen }: { userData: any, setFormOpen: any }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col lg:flex-row justify-between px-3 lg:px-32 mt-24 lg:mt-48">
            <div className="flex flex-col justify-center w-full lg:w-[40%] space-y-8">
                <p className="text-3xl md:text-4xl font-bold sm:font-semibold mb-0 text-center sm:text-left">
                    Kickstart Your Career.
                    <br />
                    It's Time!
                </p>
                {/* <p className="text-[14px] font-medium">
                    Top mentors from Frontend, Backend, Data Science, Product
                    Design, AI, and more...
                </p> */}
                <Button
                    variant="outline"
                    className="hidden sm:block text-[#21695C] font-medium border border-[#21695C] md:w-[20rem] rounded-[8px]"
                    onClick={() => {
                        userData
                                    ? router.push("/mentee/mentor-list")
                                    : setFormOpen(true)
                    }}
                >
                    Match me with a mentor
                </Button>
            </div>
            <img
                src="/turtle/video_meet.svg"
                className="scale-100 sm:scale-75 mt-14 sm:mt-0 xl:scale-100"
                alt="video meet"
            />
            <Button
                variant="outline"
                className="block sm:hidden text-[#21695C] font-semibold border border-[#21695C] mt-10 rounded-[8px]"
                onClick={() => {
                    userData
                                    ? router.push("/mentee/mentor-list")
                                    : setFormOpen(true);
                }}
            >
                Match me with a mentor
            </Button>
        </div>
    );
};

export default LastSection;
