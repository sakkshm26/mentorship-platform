"use client";
import Loader from "@/components/loader";
import { Card, CardContent } from "@/components/ui/card";
import AuthContext from "@/contexts/auth-context";
import api_client from "@/utils/axios";
import ProtectedRoute from "@/utils/protectedRoute";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

interface ListProps {
    id: string;
    name: string;
    session: string;
    nano_id?: string
}

const MentorList = () => {
    const user_context = useContext(AuthContext);
    const [mentorLists, setMentorLists] = useState<ListProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [queryOffset, setQueryOffset] = useState(0);

    const getLists = async (offset?: number) => {
        try {
            const response = await api_client.get(
                "/admin/session-mentor-list",
                { params: { offset } }
            );
            if (response.data.length < 10) {
                setHasMore(false);
            }
            if (offset) {
                setMentorLists([...mentorLists, ...response.data]);
            } else {
                setMentorLists(response.data);
                setLoading(false);
            }
        } catch (err) {
            toast("Something went wrong", { type: "error" });
        }
    };

    useEffect(() => {
        if (user_context.api_key) {
            getLists();
        }
    }, [user_context]);

    return (
        <div className="flex flex-col items-center ">
            <p className="text-xl my-10">My Lists</p>
            {loading ? (
                <Loader global={true} />
            ) : (
                <InfiniteScroll
                    dataLength={mentorLists.length}
                    next={() => {
                        setQueryOffset(queryOffset + 20);
                        getLists(queryOffset + 20);
                    }}
                    hasMore={hasMore}
                    loader={<Loader className="mt-6" />}
                >
                    {mentorLists.map((list, index) => (
                        <Card className="flex justify-center items-center my-4 cursor-pointer" onClick={() => {
                            window.open(process.env.NEXT_PUBLIC_FRONTEND_BASE_URL + "/session-mentor-list/" + (list.nano_id ? list.nano_id : list.session), "_blank")
                        }}>
                            <CardContent className="px-32 py-6">
                                <p key={index}>{list.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default ProtectedRoute(MentorList);
