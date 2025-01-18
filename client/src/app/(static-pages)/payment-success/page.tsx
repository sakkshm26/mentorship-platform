"use client";

import Footer from "@/components/new-website/footer";

const PaymentSuccess = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full flex justify-center border border-[#e8e8e8]">
                <img src="/turtle/turtle_logo.svg" className="py-3 w-28" alt="turtle_logo" />
            </div>
            <div className="bg-[#F9FAFB] pt-20 pb-32 sm:py-32 mb-[-7rem] w-full flex flex-col justify-center items-center">
                <img
                    src="/turtle/payment_success.png"
                    className="object-cover sm:object-fill h-[7rem] w-[49.4rem] bg-[#F9FAFB]"
                    alt="payment_success"
                />
                <p className="text-center sm:text-left text-2xl sm:text-4xl font-semibold mt-8">
                    Amazing, our team will contact you soon!
                </p>
            </div>
            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
};

export default PaymentSuccess;
