"use client";

import Footer from "@/components/new-website/footer";

export default function ContactUs() {
    return (
        <div className="bg-white">
            <section id="hero" className="container pt-14 mt-10 text-white">
                <div
                    className="bg-[#21695C] gap-6 md:gap-12 flex flex-col lg:flex-row min-h-[380px] lg:min-h-[420px] justify-center items-center py-12 px-6 md:px-11 rounded-xl md:rounded-3xl mb-12 lg:mb-40"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div className="w-full">
                        <h1 className="text-3xl max-w-5xl md:text-5xl lg:text-7xl font-semibold mb-4 lg:mb-7">
                            Contact Us
                        </h1>
                        <div className="mb-8 lg:mb-12 max-w-5xl">
                            If you have any questions about this privacy policy,
                            you can contact us:
                            <br />
                            <li className="mt-2">
                                <button
                                    onClick={() => {
                                        window.open(
                                            "https://wa.me/916230774969",
                                            "_blank"
                                        );
                                    }}
                                >
                                    By WhatsApp
                                </button>
                            </li>
                            <li className="mt-2">
                                By email:{" "}
                                <a href="mailto:doturtlee@gmail.com">
                                    doturtlee@gmail.com
                                </a>
                            </li>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
