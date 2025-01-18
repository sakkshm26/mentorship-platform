"use client";

import { Slider, WhiteSlider } from "@/components/Slider";
import CompanyCarousel from "@/components/new-website/companyCarousel";
import Footer from "@/components/new-website/footer";
import Navbar from "@/components/new-website/navbar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { COMPANY_MARQUEE, TUTOR_MARQUEE, addCommas } from "@/constants";
import React, { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const Mentors = () => {
    const [weeklySessions, setWeeklySessions] = useState([4]);
    const [activeTestiomonialIndex, setActiveTestiomonialIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [testimonialVisible, setTestimonialVisible] = useState(false);
    const mentor_testimonials = [
        {
            image: "/tutors/sourav_jha.webp",
            name: "Sourav Jha",
            position: "Software Developer at Microsoft",
            quote_title:
                "Turtle has been an exceptional platform for me as a mentor.",
            quote_message:
                "Their ability to match me with the perfect student, who was working on the same tech stack as I was, has not only enhanced my teaching effectiveness but also provided me with an invaluable opportunity to further polish and improve my skills.",
        },
        {
            image: "/tutors/kanan_vyas.webp",
            name: "Kanan",
            position: "ML Engineer at Jio",
            quote_title:
                "Turtle has been an exceptional platform for me as a mentor.",
            quote_message:
                "It's been so amazing to connect with students who are curious and diving into the AI field to learn more. Moreover, as an organization, you guys are doing a wonderful job. Your coordination with different students and mentors and quick scheduling of the meetings are remarkable!",
        },
        {
            image: "https://turtle-bucket.s3.ap-south-1.amazonaws.com/vijaydeep_sinha.jfif",
            name: "Vijaydeep",
            position: "Computer Scientist at Adobe",
            quote_title:
                "Turtle has been an exceptional platform for me as a mentor.",
            quote_message: `From the beginning, I received outstanding support from the entire team. 
            The collaborative environment and the commitment to excellence in education truly set them apart. I am grateful for the opportunity to be part of such a dedicated community and look forward to continuing my journey with them.
            `,
        },
    ];

    const FAQS = [
        {
            heading: "What subjects can I teach?",
            description: "Anything in tech and data",
        },
        {
            heading: "How are payments handled for sessions?",
            description: `Payments for intro sessions are sent to your bank account within 2 days after the session. 
            Payments for main sessions are processed once a month based on number of sessions completed, typically within the first 2 days of each month.`,
        },
        {
            heading: "How do I become a mentor on Turtle?",
            description: `Click on "Get Started" and fill out a short form. Our team will then contact you to create your profile. Once your profile is set up, we’ll notify you whenever you get a match, and you can start taking sessions.
            `,
        },
        {
            heading: "How does the mentoring process work?",
            description: `Once your profile is created, students can view it on our website and book an intro session with you. The intro session lasts 30 minutes, during which you'll get to know the student and create a personalized roadmap based on their needs.
            After the intro session, we'll follow up with both you and the mentee. If both parties are satisfied, we'll create a WhatsApp group that includes you, the mentee, and the Turtle Team. This group will be used for all session-related discussions and to schedule sessions based on your availability.`,
        },
        {
            heading: "Can I manage mentoring with a full-time job?",
            description: `Absolutely! Our sessions are designed to be flexible and fit around your full-time job. Most sessions are scheduled for weekends or non-working hours. You can even choose to limit your availability to strictly weekends if that works best for you. Plus, you have the option to reschedule or cancel sessions at any time, making it easy to balance mentoring with your professional commitments. `,
        },
        {
            heading: "Will my company have a problem if I do mentorship?",
            description: `Generally, no. Many of our mentors are employed by reputable companies and their employers have no issues with them mentoring. We schedule sessions outside of working hours, typically on weekends, so it doesn’t interfere with your job. It’s similar to having a hobby like creating a YouTube channel or teaching family members—something you do in your own time.`,
        },
    ];

    const handleOpenTutorForm = () => {
        window.open(
            "https://forms.gle/DMkzsyJZPJN24Cdo6",
            "_blank"
        );
    };

    useEffect(() => {
        const runEveryFourSeconds = () => {
            setTestimonialVisible(false);
            setActiveTestiomonialIndex((prev) =>
                prev === mentor_testimonials.length - 1 ? 0 : prev + 1
            );
            setTestimonialVisible(false);
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
        <div>
            <Navbar onClick={handleOpenTutorForm} />
            <div className="mentor-hero-section h-[50rem] flex flex-col z-10">
                <p className="hidden sm:block text-[30px] md:text-[50px] font-semibold mt-10 text-center leading-[50px] md:leading-[60px]">
                    Teach what you know, and <br /> unlock a side income!
                </p>
                <p className="sm:hidden text-[30px] font-semibold mt-10 text-center leading-[40px]">
                    Teach what you <br /> know, and unlock a <br /> side income!
                </p>
                <p className="hidden sm:block mt-7 text-center">
                    Connect and teach students 1:1 online. Get paid for your
                    time.
                </p>
                <p className="sm:hidden mt-3 text-center">
                    Connect and teach students 1:1 online. Get <br /> paid for
                    your time.
                </p>
                <div className="sm:hidden w-[100vw]">
                    <Marquee speed={100} className="mt-8">
                        <div className="flex">
                            {TUTOR_MARQUEE.map((itm, i) => (
                                <img
                                    key={i}
                                    className={`h-[160px] w-[150px] mr-7 rounded-xl`}
                                    src={`/tutors/${itm}.webp`}
                                    alt={itm}
                                />
                            ))}
                        </div>
                    </Marquee>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="primary"
                        onClick={handleOpenTutorForm}
                        className="mt-8 sm:mt-14 w-[90%] sm:w-[15rem] rounded-[8px]"
                    >
                        Start Teaching
                    </Button>
                </div>
            </div>
            <div className="mt-[-13rem] sm:mt-[-7rem] md:mt-[-5rem] lg:mt-[2rem] xl:mt-[7rem]">
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
            <div className="flex flex-col-reverse items-center lg:flex-row justify-between px-3 lg:px-[10%] mt-32 why-turtle">
                <div className="lg:w-[40%]">
                    <p className="text-3xl font-semibold mt-14 lg:mt-0">
                        Why teach on Turtle?
                    </p>
                    <div className="flex mt-6 items-start">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            Flexible timings: Teach whenever you want. You own
                            your schedule.
                        </p>
                    </div>
                    <div className="flex mt-5 items-start">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            Ease of teaching: Everyone has different teaching
                            styles and you can teach the way you want.
                        </p>
                    </div>
                    <div className="flex mt-5 items-start">
                        <img
                            src="/turtle/check_circle.svg"
                            className="mr-2.5"
                            alt="check_circle"
                        />
                        <p className="font-medium">
                            Greate side hustle: monetise your knowledge and help
                            people grow their career.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="border-[#21695C] text-[#21695C] w-full mt-8 font-semibold rounded-[8px]"
                        onClick={handleOpenTutorForm}
                    >
                        Start Teaching
                    </Button>
                </div>
                <img
                    src="/turtle/live_session.png"
                    className="w-[30rem] lg:w-[40%] h-auto"
                    alt="live_session"
                />
            </div>
            <div className="mt-28 md:mt-52 px-10">
                <p className="text-2xl md:text-4xl text-left md:text-center font-semibold px-3">
                    3 easy steps! That's all it takes to get started
                </p>
                <div className="flex flex-col md:flex-row justify-center mt-12 md:mt-20 space-y-20 md:space-y-0 md:space-x-4 items-center md:items-start">
                    <div className="flex flex-col max-w-[400px]">
                        <img
                            src="/turtle/mentor-form.png"
                            className="w-[90%] h-[90%]"
                            alt="mentor_form"
                        />
                        <div className="mt-12">
                            <p className="text-xl font-semibold">
                                Fill the form
                            </p>
                            <p className="mt-3 text-sm">
                                We'll get in touch with you after you fill it
                                up.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col max-w-[400px]">
                        <img
                            src="/turtle/mentor-matching.png"
                            className="w-[90%] h-[90%]"
                            alt="mentor_matching"
                        />
                        <div className="mt-12">
                            <p className="text-xl font-semibold">
                                Get matched with the student
                            </p>
                            <p className="mt-3 text-sm">
                                Meet students and get to know their
                                requirements.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col max-w-[400px]">
                        <img
                            src="/turtle/mentor-teaching.png"
                            className="w-[90%] h-[90%]"
                            alt="mentor_teaching"
                        />
                        <div className="mt-12">
                            <p className="text-xl font-semibold">
                                Start teaching
                            </p>
                            <p className="mt-3 text-sm">
                                Once we've discussed the details, you can start
                                teaching right-away.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="primary"
                        className="w-[90%] md:w-[14rem] mt-16 font-medium"
                        onClick={handleOpenTutorForm}
                    >
                        Start Teaching
                    </Button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row bg-[#21695C] text-white justify-center items-center w-full mt-28 px-[5%] 2xl:px-[10%] py-20">
                <div className="flex flex-col justify-center w-[100%] md:w-[50%]">
                    <p className="text-xl">
                        How many sessions can you take per week?
                    </p>
                    <p className="mt-7 md:mt-16 text-2xl md:text-5xl font-semibold">
                        {weeklySessions[0] === 10
                            ? weeklySessions
                            : `0${weeklySessions[0]}`}{" "}
                        <span className="text-black">sessions</span>
                    </p>
                    <WhiteSlider
                        minStepsBetweenThumbs={1}
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={weeklySessions}
                        onValueChange={setWeeklySessions}
                        className="md:w-[20rem] lg:w-[30rem] mt-4 md:mt-8"
                    />
                </div>
                <div className="hidden md:block border-l border-white h-[200px] mx-10 xl:mx-20"></div>
                <div className="w-[100%] md:w-[50%] mt-20 md:mt-0">
                    <p className="text-xl">You can take home</p>
                    <p className="text-3xl md:text-5xl xl:text-7xl font-semibold mt-6 md:mt-24 xl:mt-20">
                        ₹{" "}
                        {addCommas(
                            Math.round((weeklySessions[0] * 4.1 * 700) / 100) *
                                100
                        )}{" "}
                        <span className="text-black text-2xl xl:text-4xl font-semibold">
                            /month
                        </span>
                    </p>
                    <p className="text-white mt-5 text-xs">
                        *The cost mentioned is an average session price and may
                        vary based on the mentor's experience and the domain of
                        expertise.
                    </p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mt-36 justify-between w-[100%] space-y-16 md:space-y-0 md:space-x-16 px-3 md:px-20 lg:px-40">
                <div className="bg-[#21695C] text-white px-6 py-10 rounded-xl md:w-[40%]">
                    <img
                        src="/turtle/three_mentors.png"
                        className="h-[80px] w-[210px]"
                        alt="three_mentors"
                    />
                    <p className="text-3xl sm:text-4xl font-semibold mt-20">
                        500+ mentors
                    </p>
                </div>
                <div className="flex flex-col justify-center md:w-[60%]">
                    <p className="text-2xl sm:text-3xl font-bold leading-[30px] sm:leading-[40px]">
                        Time flexibility, easy to manage with full time job.
                    </p>
                    <p className="font-medium mt-5">
                        Turtle is designed in a way that allows our mentors to
                        decide their own hours.
                    </p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mt-12 md:mt-12 justify-between w-[100%] space-y-8 md:space-y-0 md:space-x-16 px-3 md:px-20 lg:px-40">
                <div className="flex flex-col justify-center md:w-[60%] bg-[#F8F8F8] px-3 sm:px-6 py-6 sm:py-10 rounded-xl">
                    <p className="text-2xl font-semibold transition-opacity">
                        {
                            mentor_testimonials[activeTestiomonialIndex]
                                .quote_title
                        }
                    </p>
                    <p className="text-[#7B7F93] mt-5 text-sm transition-opacity">
                        {
                            mentor_testimonials[activeTestiomonialIndex]
                                .quote_message
                        }
                    </p>
                    <div className="flex justify-between items-center mt-10">
                        <div className="flex items-center">
                            <img
                                src={
                                    mentor_testimonials[activeTestiomonialIndex]
                                        .image
                                }
                                className="h-12 w-12 rounded-full"
                                alt={`mentor_image-${activeTestiomonialIndex}`}
                            />
                            <div className="ml-4">
                                <p className="font-semibold">
                                    {
                                        mentor_testimonials[
                                            activeTestiomonialIndex
                                        ].name
                                    }
                                </p>
                                <p className="text-sm mt-2">
                                    {
                                        mentor_testimonials[
                                            activeTestiomonialIndex
                                        ].position
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <GoArrowLeft
                                size={36}
                                className="mr-2 sm:mr-5 text-[#001001] bg-[#F8F8F8] rounded-full p-[10px] cursor-pointer"
                                onClick={() =>
                                    !activeTestiomonialIndex
                                        ? setActiveTestiomonialIndex(
                                              mentor_testimonials.length - 1
                                          )
                                        : setActiveTestiomonialIndex(
                                              (prevIndex: number) =>
                                                  prevIndex - 1
                                          )
                                }
                            />
                            <GoArrowRight
                                size={36}
                                className="text-[#001001] bg-[#F8F8F8] rounded-full p-[10px] cursor-pointer"
                                onClick={() =>
                                    activeTestiomonialIndex ===
                                    mentor_testimonials.length - 1
                                        ? setActiveTestiomonialIndex(0)
                                        : setActiveTestiomonialIndex(
                                              (prevIndex: number) =>
                                                  prevIndex + 1
                                          )
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center bg-[#21695C] text-white px-6 rounded-xl md:w-[40%] py-5 md:py-0">
                    <p className="font-medium">Average time per week needed</p>
                    <p className="text-4xl font-semibold mt-8">2-5 hours</p>
                </div>
            </div>
            <div className="px-3 lg:px-32 mt-24 lg:mt-52">
                <p className="text-3xl md:text-4xl font-bold sm:font-semibold mb-0">
                    Commonly Asked Questions
                </p>
                <p className="text-[13px] lg:text-[14px] font-normal mt-5">
                    Get in touch with{" "}
                    <span
                        className="font-semibold text-[#D30E0E] cursor-pointer"
                        onClick={() =>
                            window.open(
                                "https://wa.me/916230774969?text=Hello! I'm interested in taking a trial session.",
                                "_blank"
                            )
                        }
                    >
                        support
                    </span>{" "}
                    for more assistance. We are happy to help :)
                </p>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full mt-8 lg:mt-16"
                >
                    {FAQS.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger
                                className="text-left text-base lg:text-lg font-medium"
                                style={{ textDecoration: "none" }}
                            >
                                {faq.heading}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm font-light sm:w-[70%] leading-6">
                                {faq.description
                                    .split("\n")
                                    .map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                            {line}
                                            {lineIndex <
                                                faq.description.split("\n")
                                                    .length -
                                                    1 && <br />}
                                        </React.Fragment>
                                    ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <Footer />
        </div>
    );
};

export default Mentors;
