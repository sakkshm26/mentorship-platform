import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const MenteeFAQ = () => {
    const FAQS = [
        {
            heading: "Is there a trial session?",
            description:
                "Yes, we provide a trial session at a discounted price of ₹ 200.",
        },
        {
            heading: "When is the right time to take mentorship?",
            description: `You can seek mentorship at any stage of your career, whether you're looking to upskill, switch jobs, or transition to a new domain. It doesn't matter if you're a beginner or experienced—1:1 mentorship is for everyone. \n If you're thinking, "I'll finish this course and then get mentorship to clear my doubts," think again! 1:1 mentorship is meant to teach you tech concepts comprehensively, not just to clear your doubts.`,
        },
        {
            heading: "How many sessions can I take monthly?",
            description: `On average, mentees take 4 to 8 sessions a month. However, the beauty of 1:1 mentorship is its flexibility. You can adjust the number and timing of sessions to fit your needs, even after you've paid for them. \n
                Keep in mind, 1:1 mentorship goes beyond just the sessions. To get the most out of it, you'll need to invest time on non-session days. Your mentor may assign homework or tasks to work on before your next session.`,
        },
        {
            heading: "Why is mentorship more costly than a course?",
            description: `We offer personalization, one-on-one guidance tailored specifically to your needs. Our mentors are highly experienced professionals who already receive competitive salaries in their full-time roles, so we need to offer them significant compensation to dedicate time to mentoring.
                While courses often have low completion rates (2%-35%), our mentorship program boasts a completion rate of 90%, reflecting the high value and effectiveness of personalized mentorship. The investment in mentorship provides a higher return in terms of tailored support and successful outcomes.`,
        },
        {
            heading: "What if I don’t like my mentor?",
            description: `We will do our best to match you with a new mentor who better suits your needs.`,
        },
    ];

    return (
        <div className="px-3 lg:px-32 mt-24 lg:mt-52" id="faqs">
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
                                            faq.description.split("\n").length -
                                                1 && <br />}
                                    </React.Fragment>
                                ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default MenteeFAQ;
