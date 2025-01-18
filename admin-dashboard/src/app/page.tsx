"use client";
import { Button } from "@/components/ui/button";
import AuthContext from "@/contexts/auth-context";
import ProtectedRoute from "@/utils/protectedRoute";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const Home = () => {
    const router = useRouter();

    return (
        <div>
            <div>
                <Button
                    className="m-5"
                    onClick={() => router.push("/mentor-list/create")}
                >
                    Create a Mentor List
                </Button>
                <Button
                    className="m-5"
                    onClick={() => router.push("/mentor-list")}
                >
                    My Lists
                </Button>
            </div>
            <div>
                <Button className="m-5" onClick={() => router.push("/mentors")}>All Mentors</Button>
                <Button className="m-5" onClick={() => router.push("/mentees")}>All Mentees</Button>
            </div>
        </div>
    );
};

export default ProtectedRoute(Home);
