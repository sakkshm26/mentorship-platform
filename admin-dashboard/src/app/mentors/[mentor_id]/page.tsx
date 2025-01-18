"use client";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api_client from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Mentor = ({ params }: any) => {
    const { mentor_id } = params;
    const [mentorData, setMentorData] = useState({
        full_name: "",
        phone: "",
        email: "",
        heading: "",
        about: "",
        internal_rating: "",
        external_rating: "",
        session_count: "",
        hidden: "",
    });
    const [loading, setLoading] = useState(true);

    const getMentor = async () => {
        try {
            const response = await api_client.get(`/admin/mentor/${mentor_id}`);
            setMentorData({
                full_name: response.data.user.full_name,
                phone: response.data.user.phone,
                email: response.data.user.email || "",
                heading: response.data.heading,
                about: response.data.about,
                internal_rating: response.data.internal_rating,
                external_rating: response.data.external_rating,
                session_count: response.data.session_count,
                hidden: response.data.hidden === true ? "true" : "false",
            });
            setLoading(false);
        } catch (err) {
            toast("Some error occurred", { type: "error" });
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api_client.put(`/admin/mentor/${mentor_id}`, {...mentorData, hidden: mentorData.hidden === "true"});
            toast("Success", { type: "success" });
            setLoading(false);
        } catch (err) {
            toast("Some error occurred", { type: "error" });
        }
    };

    useEffect(() => {
        getMentor();
    }, []);

    return loading ? (
        <Loader global={true} />
    ) : (
        <form className="p-5" onSubmit={handleSubmit}>
            <div>
                <label>Full Name</label>
                <Input
                    name="full_name"
                    value={mentorData.full_name}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>Email</label>
                <Input
                    name="email"
                    value={mentorData.email}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>Phone</label>
                <Input
                    name="phone"
                    value={mentorData.phone}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>Heading</label>
                <Input
                    name="heading"
                    value={mentorData.heading}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            heading: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>About</label>
                <Textarea
                    name="about"
                    value={mentorData.about}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            about: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>Internal Rating</label>
                <Input
                    name="internal_rating"
                    value={mentorData.internal_rating}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            internal_rating: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>External Rating</label>
                <Input
                    name="external_rating"
                    value={mentorData.external_rating}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            external_rating: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>Session Count</label>
                <Input
                    name="session_count"
                    value={mentorData.session_count}
                    onChange={(e) =>
                        setMentorData((prev) => ({
                            ...prev,
                            session_count: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="mt-4">
                <label>Hidden</label>
                <Select
                    value={mentorData.hidden}
                    onValueChange={(value) =>
                        setMentorData((prev) => ({ ...prev, hidden: value }))
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="mt-5 w-full">
                Update
            </Button>
        </form>
    );
};

export default Mentor;
