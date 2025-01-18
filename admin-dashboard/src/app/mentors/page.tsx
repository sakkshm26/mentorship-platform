"use client";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api_client from "@/utils/axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface mentorType {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
}

const Mentors = () => {
    const router = useRouter();
    const [mentors, setMentors] = useState<mentorType[]>([]);
    const [loading, setLoading] = useState(true);
    const [queryOffset, setQueryOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filterData, setFilterData] = useState({
        phone: "",
        email: "",
        name: "",
    });

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Name", accessor: "full_name" },
        { header: "Phone", accessor: "phone" },
        { header: "Email", accessor: "email" },
    ];

    const getMentors = async ({ offset }: { offset?: number }) => {
        try {
            const response = await api_client.get(
                `/admin/mentor/all?limit=20&offset=${offset}&name=${filterData.name}&phone=${filterData.phone}&email=${filterData.email}`
            );
            if (response.data.length < 20) {
                setHasMore(false);
            }
            setMentors((prev) => [...prev, ...response.data]);
            setLoading(false);
        } catch (err) {
            toast("Error fetching mentors", { type: "error" });
        }
    };

    const handleFilterSearch = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            setQueryOffset(0);
            setHasMore(true);
            const response = await api_client.get(
                `/admin/mentor/all?limit=20&name=${filterData.name}&phone=${filterData.phone}&email=${filterData.email}`
            );
            setMentors(response.data);
            setLoading(false);
        } catch (err) {}
    };

    useEffect(() => {
        getMentors({ offset: 0 });
    }, []);

    return (
        <div>
            <form className="flex flex-col justify-center items-center border-2 border-red-100 m-5 p-4">
                <Input
                    name="name"
                    placeholder="Name"
                    className="mb-4"
                    value={filterData.name}
                    onChange={(e) =>
                        setFilterData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    type="text"
                />
                <Input
                    name="phone"
                    placeholder="Phone"
                    className="mb-4"
                    value={filterData.phone}
                    onChange={(e) =>
                        setFilterData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                        }))
                    }
                    type="text"
                />
                <Input
                    name="email"
                    placeholder="Email"
                    className="mb-4"
                    value={filterData.email}
                    onChange={(e) =>
                        setFilterData((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }
                    type="email"
                />
                <Button type="submit" onClick={handleFilterSearch}>
                    Search
                </Button>
            </form>
            {loading ? (
                <Loader global={true} />
            ) : (
                <div className="h-full overflow-y-auto">
                    <div className="overflow-x-auto p-4">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className="py-2 px-4 border-b text-left whitespace-nowrap text-base"
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="overflow-y-auto">
                                {mentors.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={`${
                                            rowIndex % 2 === 0
                                                ? "bg-gray-50"
                                                : "bg-white"
                                        } cursor-pointer hover:text-blue-500`}
                                        onClick={() =>
                                            router.push(
                                                `/mentors/${row.id}`
                                            )
                                        }
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="py-2 px-3 border-b whitespace-nowrap text-sm"
                                            >
                                                {(row as any)[column.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-center mt-8 mb-2">
                            <Button
                                onClick={() => {
                                    if (hasMore) {
                                        getMentors({
                                            offset: queryOffset + 20,
                                        });
                                        setQueryOffset(queryOffset + 20);
                                    } else {
                                        toast("No more mentors to fetch ", {
                                            type: "info",
                                        });
                                    }
                                }}
                            >
                                Fetch more
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentors;
