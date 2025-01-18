"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQueryModalState = (
    name: string,
    maintainHistory: boolean = true
) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const state = !!searchParams.get(name);

    const toggle = (bool: boolean, clearQuery: boolean = false) => {
        const newSearchParams = new URLSearchParams(
            clearQuery ? "" : searchParams.toString()
        );

        if (bool) {
            newSearchParams.set(name, "true");
        } else {
            newSearchParams.delete(name);
        }

        const newQuery = newSearchParams.toString();
        const newUrl = `${pathname}${newQuery ? `?${newQuery}` : ""}`;

        if (maintainHistory) {
            router.push(newUrl, { scroll: false });
        } else {
            router.replace(newUrl, { scroll: false });
        }
    };

    return { state, toggle };
};
