import {} from "@/app/page";
import { useEffect, useState } from "react";
import "./styles.css";
import { COMPANY_MARQUEE } from "@/constants";

const CompanyCarousel = () => {
    const [currentSet, setCurrentSet] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const logosPerSet = 6; // 6 logos per set

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentSet(
                    (prevSet) =>
                        (prevSet + 1) %
                        Math.ceil(COMPANY_MARQUEE.length / logosPerSet)
                );
                setIsTransitioning(false);
            }, 800);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="company-carousel">
            <div
                className={`logo-container ${
                    isTransitioning ? "fade-out" : "fade-in"
                }`}
            >
                {COMPANY_MARQUEE.slice(
                    currentSet * logosPerSet,
                    currentSet * logosPerSet + logosPerSet
                ).map((logo, index) => (
                    <div key={index} className="logo-wrapper items-center">
                        <img
                            src={`/turtle/company_logos/${logo.name}.svg`}
                            className={`company-logo ${
                                logo.name === "amazon"
                                    ? "mt-3"
                                    : logo.name === "disney_hotstar" ? "mt-[-20px]" : ""
                            }`}
                            style={{ height: logo.height, width: logo.width }}
                            alt="company logo"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyCarousel;
