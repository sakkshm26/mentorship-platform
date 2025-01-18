import React, { useState, useEffect } from "react";
import "./styles.css";

const MentorCarousel = ({ mentors }: any) => {
    const [currentIndex, setCurrentIndex] = useState(2);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mentors.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [mentors.length]);

    const getPosition = (
        index: number,
        currentIndex: number,
        totalMentors: number
    ) => {
        const diff = (index - currentIndex + totalMentors) % totalMentors;
        if (diff === 0) return "center";
        if (diff === totalMentors - 1) return "below-center";
        if (diff === totalMentors - 2) return "bottom";
        if (diff === 1) return "above-center";
        if (diff === 2) return "top";
        return diff < totalMentors / 2 ? "hidden-top" : "hidden-bottom";
    };

    return (
        <div className="carousel-container">
            {mentors.map((mentor: any, index: number) => (
                <div
                    key={mentor.id}
                    className={`mentor-card ${getPosition(
                        index,
                        currentIndex,
                        mentors.length
                    )} right-[10%]`}
                >
                    <MentorCardContent
                        mentor={mentor}
                        position={getPosition(
                            index,
                            currentIndex,
                            mentors.length
                        )}
                    />
                </div>
            ))}
        </div>
    );
};

const MentorCardContent = ({ mentor, position }: any) =>
    position === "center" ? (
        <div className="flex flex-col justify-between h-[100%] px-4 py-2.5">
            <div className="flex items-center">
                <img src={mentor.image} className="h-10 w-10 rounded-full" alt="mentor image" />
                <div className="flex flex-col ml-3">
                    <p className="text-[14px] font-medium sm:font-semibold mb-0">{mentor.name}</p>
                    <p className="text-[12px] mb-0">
                        {mentor.title}
                    </p>
                </div>
            </div>
            <div className="flex">
                {mentor.skills.map((skill: string, index: number) => (
                    <p className="mb-0 text-xs font-medium sm:font-medium py-1 px-2.5 bg-gray-100 rounded-xl mx-1.5" key={index}>
                        {skill}
                    </p>
                ))}
            </div>
        </div>
    ) : (
        <div className="px-4 flex items-center h-[100%]">
            <img src={mentor.image} className="h-10 w-10 rounded-full" alt="mentor image" />
            <div className="flex flex-col justify-center items-start ml-3 ">
                <p className="mb-0 text-[11px] font-medium sm:font-semibold">{mentor.name}</p>
                <p className="mb-0 text-[10px]">{mentor.title}</p>
            </div>
        </div>
    );

const MentorsVerticalAnimation = () => {
    const mentors = [
        {
            name: "Ritesh Soun",
            title: "ML Engineer, Tower Research Capital",
            image: "https://turtle-bucket.s3.ap-south-1.amazonaws.com/ritesh_soun.webp",
            skills: ["Python", "NLP", "Generative AI"],
        },
        {
            name: "Rajaswa Patil",
            title: "AI Researcher, Postman",
            image: "https://www.turtlex.in/mentors/rajaswa_patil.webp",
            skills: ["Python", "SQL", "Generative AI"],
        },
        {
            name: "Mayank Kakkar",
            title: "SDE 3, Google",
            image: "https://turtle-bucket.s3.ap-south-1.amazonaws.com/mayank_kakkar.jfif",
            skills: ["DSA", "Golang", "System Design"],
        },
        {
            name: "Jasmeen Bansal",
            title: "Software Engineer, Google",
            image: "https://turtle-bucket.s3.ap-south-1.amazonaws.com/jasmeen_bansal.jfif",
            skills: ["DSA", "Python", "Django"],
        },
        {
            name: "Krishan Kumar",
            title: "Business Analyst, Blinkit",
            image: "https://turtle-bucket.s3.ap-south-1.amazonaws.com/krishan_kumar.jfif",
            skills: ["DSA", "Python", "SQL"],
        },
        {
            name: "Satyam Gupta",
            title: "SDE 2, MongoDB",
            image: "https://turtle-bucket.s3.ap-south-1.amazonaws.com/satyam_gupta.jfif",
            skills: ["SQL", "Python", "DBMS"],
        },
        {
            name: "Sourav Jha",
            title: "Software Developer, Microsoft",
            image: "https://www.turtlex.in/mentors/sourav_jha.webp",
            skills: ["LLD", "DSA", "Operating System"],
        },
    ];

    return (
        <div
            className="h-full relative overflow-hidden"
            style={{ width: "400px" }}
        >
            <MentorCarousel mentors={mentors} />
        </div>
    );
};

export default MentorsVerticalAnimation;
