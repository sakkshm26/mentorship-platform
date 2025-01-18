"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import * as pixel from "../lib/fbp";
import mixpanel from "mixpanel-browser";

export const FacebookPixel = () => {
    const [loaded, setLoaded] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (!loaded) return;

        // pixel.pageview()
    }, [pathname, loaded]);

    return (
        <Script
            id="fb-pixel"
            src="/scripts/pixel.js"
            strategy="afterInteractive"
            onLoad={() => setLoaded(true)}
            data-pixel-id={pixel.FB_PIXEL_ID}
        />
    );
};

export const MixpanelTracking = () => {
    const pathname = usePathname();
    const query = useSearchParams();
    const url =
        pathname + (query.toString() !== "" ? `?${query.toString()}` : "");

    const savedPathNameRef = useRef(url);

    useEffect(() => {
        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "", {
            track_pageview: true,
            persistence: "localStorage",
            ignore_dnt: true,
        });
    }, []);

    useEffect(() => {
        const handleRouteChange = (path: string) => {
            const trackerData = {
                pathname: path,
                url,
                query: Object.fromEntries(query),
                product: "boldd",
            };

            mixpanel.track("page_view", trackerData);
        };

        if (typeof window !== "undefined") {
            handleRouteChange(url);
            savedPathNameRef.current = url;
        }
    }, [url]);

    return <></>;
};
