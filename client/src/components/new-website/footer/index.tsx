import { useRouter } from "next/navigation";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
    const router = useRouter();

    return (
        <div className="mt-24 pb-32 sm:mt-56 px-5 lg:px-24">
            <div className="flex flex-col lg:flex-row justify-between">
                <div>
                    <img src="/turtle/turtle_logo.svg" alt="turtle logo" />
                    <p className="text-xl mt-8 font-medium lg:w-[400px]">
                        One-on-one coaching from the best mentors in the
                        industry.
                    </p>
                </div>
                <div className="flex justify-between space-x-5 md:space-x-20 mt-10 lg:mt-0">
                    <div className="md:mr-10">
                        <p className="underline font-semibold mb-6">Subjects</p>
                        <div className="flex flex-col space-y-2 mt-4">
                            <a
                                className="text-sm text-[#7B7F93] cursor-pointer"
                                href="#our-mentors"
                            >
                                Our Mentors
                            </a>
                            <a
                                className="text-sm text-[#7B7F93] cursor-pointer"
                                href="#testimonials"
                            >
                                Testimonials
                            </a>
                            <a
                                className="text-sm text-[#7B7F93] cursor-pointer"
                                href="#faqs"
                            >
                                FAQs
                            </a>
                            <p
                                className="text-sm text-[#7B7F93] cursor-pointer"
                                onClick={() =>
                                    router.push("/mentors")
                                }
                            >
                                Become A Mentor
                            </p>
                        </div>
                    </div>
                    {/* <div>
                        <p className="text-base sm:text-lg underline font-semibold mb-6">
                            Company
                        </p>
                        <F className="text-sm sm:text-base text-[#7B7F93]">
                            About Us
                        </F
                        <p className="text-sm sm:text-base text-[#7B7F93]">
                            Careers
                        </p>
                        <p className="text-sm sm:text-base text-[#7B7F93]">
                            Join Today
                        </p>
                    </div>
                    <div>
                        <p className="text-base sm:text-lg underline font-semibold mb-6">
                            Resources
                        </p>
                        <p className="text-sm sm:text-base text-[#7B7F93]">
                            About Us
                        </p>
                        <p className="text-sm sm:text-base text-[#7B7F93]">
                            Careers
                        </p>
                        <p className="text-sm sm:text-base text-[#7B7F93]">
                            Join Today
                        </p>
                    </div> */}
                </div>
            </div>
            <hr className="my-10" />
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex justify-between w-[300px] font-normal">
                    <p
                        className="text-[#adadad] cursor-pointer"
                        onClick={() => router.push("/privacy-policy")}
                    >
                        Privacy Policy
                    </p>
                    <p
                        className="text-[#adadad] cursor-pointer"
                        onClick={() => router.push("/terms-conditions")}
                    >
                        Terms & Conditions
                    </p>
                </div>
                <div className="flex mt-8 sm:mt-0">
                    <FaInstagram
                        size={24}
                        className="mx-4 cursor-pointer"
                        onClick={() =>
                            window.open("https://www.instagram.com/turtlex.in/")
                        }
                    />
                    <FaLinkedin
                        size={24}
                        className="mx-4 cursor-pointer"
                        onClick={() =>
                            window.open(
                                "https://www.linkedin.com/company/getboldd/"
                            )
                        }
                    />
                    <FaFacebookF
                        size={24}
                        className="mx-4 cursor-pointer"
                        onClick={() =>
                            window.open(
                                "https://www.facebook.com/profile.php?id=61555994620861"
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Footer;
