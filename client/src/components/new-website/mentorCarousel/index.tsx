import React, { useState, useEffect, useRef } from "react";
// import "./styles.css";
import MentorCard from "../mentorCard";

interface MentorCarouselProps {
    mentors: {
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
    }[];
    mentorsRef: any;
    setFormOpenFromCard: any
}

const MentorCarousel = ({
    mentors,
    mentorsRef,
    setFormOpenFromCard
}: MentorCarouselProps) => {
    return (
        <div className="flex overflow-x-scroll space-x-7 mt-5" ref={mentorsRef}>
            {mentors.map((mentor, index) => (
                <div key={index} className="carousel-item">
                    <MentorCard
                    id={mentor.id}
                        full_name={mentor.full_name}
                        heading={mentor.heading}
                        profile_image_url={mentor.profile_image_url}
                        skills={mentor.skills}
                        companies={mentor.organizations}
                        years_experience={mentor.years_experience}
                        about={mentor.about}
                        per_month_fee={mentor.per_month_fee}
                        trial_fee={mentor.trial_fee}
                        job_experiences={mentor.job_experiences}
                        setFormOpenFromCard={setFormOpenFromCard}
                    />
                </div>
            ))}
        </div>
    );
};

export default MentorCarousel;
