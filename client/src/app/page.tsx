"use client";
import { useContext, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import ScrollStack from "@/components/new-website/scroll-stack";
import Navbar from "@/components/new-website/navbar";
import { Button } from "@/components/ui/button";
import MentorsVerticalAnimation from "@/components/new-website/mentorsVerticalAnimation";
import { COMPANY_MARQUEE, DOMAINS } from "@/constants";
import { MultiSelect } from "@/components/dropdowns/Multiselect";
import MentorsFilter from "@/components/new-website/mentorsFilter";
import Testimonials from "@/components/new-website/testimonials/indes";
import Steps from "@/components/new-website/steps";
import LastSection from "@/components/new-website/lastSection";
import MenteeFAQ from "@/components/new-website/menteeFaq";
import Footer from "@/components/new-website/footer";
import CompanyCarousel from "@/components/new-website/companyCarousel";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/auth-context";
import { UserDataProps } from "@/components/Navbar";
import api_client from "@/utils/axios";
import { toast } from "react-toastify";
import { MenteeForm } from "@/components/MenteeForm";
import BottomBar from "@/components/new-website/bottomBar";
import Section1 from "@/components/new-website/section1";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Home = () => {
    const { push } = useRouter();
    const user_context = useContext(AuthContext);
    const [userData, setUserData] = useState<UserDataProps | null>();
    // const [isChatButtonVisible, setIsChatButtonVisible] = useState(false);
    const [selectedDomains, setSelectedDomains] = useState<
        Record<"value" | "label", string>[]
    >([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formOpenFromCard, setFormOpenFromCard] = useState(false);

    const getUser = async () => {
        try {
            const response = await api_client.get(
                `/internal/user/${user_context.session?.user_id}`
            );
            setUserData(response.data);
        } catch (error) {
            toast("Something went wrong", { type: "error" });
        }
    };

    const handleLogout = async () => {
        try {
            await api_client.post("/internal/user/auth/logout");
            localStorage.clear();
            user_context.setUser!((prev: any) => ({
                ...prev,
                session: undefined,
            }));
            setUserData(undefined);
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    useEffect(() => {
        if (!user_context.is_loading) {
            if (user_context.session) {
                getUser();
            } else {
                setUserData(null);
            }
        }
    }, [user_context]);

    return (
        <div className="bg-white">
            <Dialog
                open={formOpen}
                onOpenChange={(value) => setFormOpen(value)}
            >
                <DialogContent className="bld flex gap-10 rounded-2xl md:p-10 max-h-[95%] md:max-h-[auto] max-w-[92vmin] md:max-w-5xl overflow-y-scroll">
                    <div className="w-full shrink-0 md:basis-1/2">
                        <MenteeForm initialDomains={selectedDomains} />
                    </div>
                    <div className="hidden grow items-center bg-[#f3fffd] px-4 md:flex">
                        <img
                            src="/turtle/form_image.png"
                            alt="lady tutoring online"
                        />
                    </div>
                </DialogContent>
            </Dialog>
            {!formOpen && !formOpenFromCard ? (
                <BottomBar userData={userData} setFormOpen={setFormOpen} />
            ) : null}
            <Navbar
                userData={userData}
                domains={selectedDomains}
                setFormOpen={setFormOpen}
            />
            <Section1
                selectedDomains={selectedDomains}
                setSelectedDomains={setSelectedDomains}
                userData={userData}
                setFormOpen={setFormOpen}
            />
            {/* <div className="flex justify-center items-center mt-24">
                <iframe
                    className="w-[93%] md:w-[85%] h-[300px] md:h-[600px] rounded-3xl"
                    src="https://www.youtube.com/embed/hOHKltAiKXQ"
                ></iframe>
            </div> */}
            <ScrollStack userData={userData} setFormOpen={setFormOpen} />
            <MentorsFilter setFormOpenFromCard={setFormOpenFromCard} />
            <Testimonials />
            <Steps />
            {/* <LastSection userData={userData} setFormOpen={setFormOpen} /> */}
            <MenteeFAQ />
            <Footer />
        </div>
    );
};

export default Home;
