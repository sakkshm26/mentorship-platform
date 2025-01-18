"use client";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api_client from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Mentee = ({ params }: any) => {
    const { mentee_id } = params;
    const [menteeData, setMenteeData] = useState({
        full_name: "",
        phone: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);

    const getMentee = async () => {
        try {
            const response = await api_client.get(`/admin/mentee/${mentee_id}`);
            setMenteeData({ full_name: response.data.user.full_name, phone: response.data.user.phone, email: response.data.user.email || "" });
            setLoading(false);
        } catch (err) {
            toast("Some error occurred", { type: "error" });
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api_client.put(`/admin/mentee/${mentee_id}`, menteeData);
            toast("Success", { type: "success" });
            setLoading(false);
        } catch (err) {
            toast("Some error occurred", { type: "error" });
        }
    }

    useEffect(() => {
        getMentee();
    }, []);

    return loading ? (
        <Loader global={true} />
    ) : (
        <form className="p-5" onSubmit={handleSubmit}>
            <div>
                <label>Full Name</label>
                <Input
                    name="full_name"
                    value={menteeData.full_name}
                    onChange={(e) =>
                        setMenteeData((prev) => ({
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
                    value={menteeData.email}
                    onChange={(e) =>
                        setMenteeData((prev) => ({
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
                    value={menteeData.phone}
                    onChange={(e) =>
                        setMenteeData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                        }))
                    }
                />
            </div>
            <Button type="submit" className="mt-5 w-full">Update</Button>
        </form>
    );
};

export default Mentee;
