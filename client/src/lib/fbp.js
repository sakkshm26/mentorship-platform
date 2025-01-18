import api_client from "@/utils/axios";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const customFBEvent = (name, options = {}, event_id) => {
    window.fbq("trackCustom", name, options, { eventID: event_id });
};

export const sendFBConversionEvent = async ({
    isLoggedIn,
    event_name,
    event_id,
}) => {
    try {
        if (isLoggedIn) {
            await api_client.post("/internal/user/fb-conversion", {
                event_name,
                event_id,
                event_source_url: window.location.href,
            });
        } else {
            await api_client.post("/open/fb-conversion", {
                event_name,
                event_id,
                event_source_url: window.location.href,
            });
        }
    } catch (err) {}
};
