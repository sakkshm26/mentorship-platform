import { useEffect, useRef, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const Testimonials = () => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const testimonials = [
        {
            image: "/turtle/testimonials/rahul.PNG",
            name: "Rahul",
            position: "Learning Springboot",
            quote: "The standout feature was the opportunity to select a mentor based on their professional background and discuss the course agenda in the intro session. At one point, I needed to change my mentor, and the team was incredibly supportive.",
        },
        {
            image: "/turtle/testimonials/veda.JPEG",
            name: "Veda",
            position: "Learning Python",
            quote: "As an undergrad student, having a connection with an industry professional who guides me through projects from scratch is incredibly cool! I could contact my mentor at any time, hop on calls, and stay connected even after sessions. ",
        },
        {
            image: "/turtle/testimonials/prathmesh.JPEG",
            name: "Prathmesh",
            position: "Learning MERN",
            quote: "The mentorship sessions helped me to learn new concepts and instantly solve doubts. Timings were really flexible and having a mentor helped me to stay accountable and get proper guidance.",
        },
        {
            image: "/turtle/testimonials/subhajit.PNG",
            name: "Subhajit",
            position: "Learning DevOps",
            quote: "My DevOps training was led by a highly knowledgeable and experienced mentor. The energy he brings to each session is amazing, he made complex concepts easy to grasp. My mentor was patient, thorough, and genuinely invested in my learning.",
        },
        {
            image: "/turtle/testimonials/gokulraaj.JPEG",
            name: "Gokulraaj",
            position: "Learning DSA",
            quote: "1:1 mentorship turned out to be the best decision. Jasmeen provided tips to solve problems, explained each topic's concepts clearly and adapted her teaching style to fit my needs. After just a few sessions I can already see a difference.",
        },
    ];

    useEffect(() => {
        const runEveryFourSeconds = () => {
            setActiveIndex((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            );
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
    }, []);

    return (
        <div
            className="mt-12 md:mt-20 px-3 sm:px-32 py-14 md:pt-40 md:pb-56 bg-[#21695c] text-white"
            id="testimonials"
        >
            <p className="text-3xl md:text-4xl font-semibold">
                Find The Right Mentor For You
            </p>
            {/* <p className="text-xs sm:text-sm mt-4 sm:mt-10 font-light">
                With over 100+ tutors and 600+ learners, we know tech.
            </p> */}
            <div className="flex flex-col sm:items-center md:flex-row mt-24 md:space-x-20">
                <img
                    src={testimonials[activeIndex].image}
                    alt="testimonials"
                    className="h-[250px] w-[250px] sm:h-[300px] sm:w-[300px]"
                />
                <div className="flex flex-col justify-between py-7 sm:py-0 md:w-[60%] mt-5 md:mt-0">
                    <div>
                        <img
                            src="/turtle/quotes_vector.svg"
                            alt="quotes"
                            className="h-8 w-8"
                        />
                        <p className="text-xl font-normal mt-3 leading-8">
                            {testimonials[activeIndex].quote}
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-10 md:mt-20">
                        <div>
                            <p className="mb-0 text-xl font-normal">
                                {testimonials[activeIndex].name}
                            </p>
                            <p className="mb-0 text-sm font-light mt-3">
                                {testimonials[activeIndex].position}
                            </p>
                        </div>
                        <div className="flex">
                            <GoArrowLeft
                                size={36}
                                className="mr-5 text-[#001001] bg-white rounded-full p-[10px] cursor-pointer"
                                onClick={() =>
                                    !activeIndex
                                        ? setActiveIndex(
                                              testimonials.length - 1
                                          )
                                        : setActiveIndex(
                                              (prevIndex: number) =>
                                                  prevIndex - 1
                                          )
                                }
                            />
                            <GoArrowRight
                                size={36}
                                className="text-[#001001] bg-white rounded-full p-[10px] cursor-pointer"
                                onClick={() =>
                                    activeIndex === testimonials.length - 1
                                        ? setActiveIndex(0)
                                        : setActiveIndex(
                                              (prevIndex: number) =>
                                                  prevIndex + 1
                                          )
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
