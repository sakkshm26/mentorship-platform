import React from "react";

const Steps = () => {
    return (
        <div className="mt-16 md:mt-32 px-3 lg:px-[2%] xl:px-[10%] py-6 md:py-30">
            <p className="text-center text-[#21695C] font-medium">
                DON'T JUST LEARN FROM BORING COURSES
            </p>
            <p className="text-center text-3xl md:text-[40px] font-semibold mt-6 md:mt-6">
                Personalize Your Learning Experience
            </p>
            <div className="flex flex-col items-center md:items-start md:flex-row mt-12 md:mt-28 md:justify-between">
                <div className="flex flex-col items-center mt-5 md:mt-0 md:w-[31%]">
                    <img
                        src="/turtle/personalized_guidance.png"
                        className="h-[320px] w-[320px]"
                        alt="personalized guidance"
                    />
                    <div className="mt-12 md:mt-0 sm:py-10 md:py-24">
                        <p className="text-left text-[24px] font-semibold">
                            Personalized Guidance
                        </p>
                        <p className="text-left text-[16px] font-normal leading-6">
                            Mentor will customize the entire program according
                            to your goal and timeline.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-32 md:mt-0 md:w-[31%]">
                    <img
                        src="/turtle/live_sessions.png"
                        className="h-[320px] w-[320px] mt-[-90px] md:mt-0"
                        alt="live sessions"
                    />
                    <div className="sm:py-10 md:py-24">
                        <p className="text-left text-[24px] font-semibold">
                            1-1 live sessions
                        </p>
                        <p className="text-left text-[16px] font-normal leading-6">
                            Don't just learn, develop experience along the way.
                            Build real-world use case projects with your mentor.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-24 md:mt-0 md:w-[31%]">
                    <img
                        src="/turtle/live_1_1.png"
                        alt="live 1-1"
                        className="h-[320px] w-[320px]"
                    />
                    <div className="mt-12 md:mt-0 sm:py-10 md:py-24">
                        <p className="text-left text-[24px] font-semibold">
                            Unlock the potential of live 1-1
                        </p>
                        <p className="text-left text-[16px] font-normal leading-6">
                            4x faster than any course or bootcamp at 20% less price. Achieve your goals faster and land your dream job.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Steps;
