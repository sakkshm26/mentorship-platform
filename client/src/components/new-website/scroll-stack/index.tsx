import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ScrollStack = ({ userData, setFormOpen }: { userData: any, setFormOpen: any }) => {
    const sectionRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const { top, height } = (
                    sectionRef as any
                ).current.getBoundingClientRect();
                const scrollPosition = window.scrollY;
                const sectionTop = scrollPosition + top;
                const sectionBottom = sectionTop + height;

                if (
                    scrollPosition >= sectionTop &&
                    scrollPosition <= sectionBottom
                ) {
                    const progress =
                        (scrollPosition - sectionTop) /
                        (height - window.innerHeight);
                    setScrollProgress(Math.min(Math.max(progress, 0), 1));
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getImageTransform = (index: number) => {
        if (index === 0) {
            return "translateY(0%)";
        }
        const thresholds = [0, 0.1, 0.5];
        const maxTranslate = [0, 0, 20];
        const transitionRanges = [0.15, 0.2, 0.2];

        let progress;
        if (scrollProgress < thresholds[index]) {
            progress = 0;
        } else if (
            scrollProgress >
            thresholds[index] + transitionRanges[index]
        ) {
            progress = 1;
        } else {
            progress =
                (scrollProgress - thresholds[index]) / transitionRanges[index];
        }

        const translateY = 100 - progress * (100 - maxTranslate[index]);
        return `translateY(${translateY}%)`;
    };

    const getTextTransform = (index: number) => {
        if (index === 0) {
            return "translateY(0%)";
        }
        const thresholds = [0, 0.1, 0.5];
        const transitionRanges = [0.15, 0.2, 0.2];

        let progress;
        if (scrollProgress < thresholds[index]) {
            progress = 0;
        } else if (
            scrollProgress >
            thresholds[index] + transitionRanges[index]
        ) {
            progress = 1;
        } else {
            progress =
                (scrollProgress - thresholds[index]) / transitionRanges[index];
        }

        const translateY = 100 - progress * 100;
        return `translateY(${translateY}%)`;
    };

    return (
        <div className="scroll-animation-section" ref={sectionRef}>
            <div className="content-wrapper">
                <div className="content-left">
                    <p className="hidden sm:block text-4xl font-semibold leading-[44px]">
                        Get Matched With
                        <br /> The Best Mentor
                    </p>
                    <p className="sm:hidden text-[32px] sm:text-3xl font-bold leading-[40px] sm:leading-[44px]">
                        Get Matched With <br /> The Best Mentor
                    </p>
                    <p className="mt-0 sm:mt-3 text-[16px] font-light">
                        Provide your details, and turtle will curate a list of
                        top mentors for you.
                    </p>
                    <Button
                        variant="outline"
                        className="text-[#21695C] border border-[#21695C] h-12 w-40 mt-3 text-[16px] rounded-[8px]"
                        onClick={() => {
                            userData
                                ? router.push("/mentee/mentor-list")
                                : setFormOpen(true)
                        }}
                    >
                        Get Started
                    </Button>
                </div>
                <div className="content-right sm:mt-10">
                    <div
                        className={`image-text-container`}
                        style={{ transform: getImageTransform(0) }}
                    >
                        <div className="image-container">
                            <Image
                                src="/turtle/phone-form.png"
                                loading="eager"
                                className=""
                                alt="phone-form"
                                height={0}
                                width={0}
                                sizes="100vw"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </div>
                        <div
                            className="image-text"
                            style={{ transform: getTextTransform(0) }}
                        >
                            <p className="text-xl font-medium">
                                Fill in the details about yourself.
                            </p>
                        </div>
                    </div>
                    <div
                        className={`image-text-container`}
                        style={{ transform: getImageTransform(1) }}
                    >
                        <div className="image-container">
                            <Image
                                src="/turtle/phone-mentors.png"
                                loading="eager"
                                className="mt-0.5 h-[92%] w-[100%] sm:mt-0.5"
                                alt="phone-mentors"
                                width={0}
                                height={0}
                                sizes="100vw"
                            />
                        </div>
                        <div
                            className="image-text"
                            style={{ transform: getTextTransform(1) }}
                        >
                            <p className="text-xl font-medium">
                                Turtle will curate a list of the best mentors
                                available for you
                            </p>
                        </div>
                    </div>
                    <div
                        className={`image-text-container last-card`}
                        style={{ transform: getImageTransform(2) }}
                    >
                        <div className="image-container">
                            <Image
                                src="/turtle/mentor-info.png"
                                loading="eager"
                                className="h-[100%] w-[100%] sm:h-[90%] sm:w-[90%] mentor-info-image"
                                alt="mentor-info"
                                height={0}
                                width={0}
                                sizes="100vw"
                            />
                        </div>
                        <div
                            className="image-text"
                            style={{ transform: getTextTransform(2) }}
                        >
                            <p className="text-xl font-medium">
                                Book an intro session with mentor of your choice
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollStack;
