import axios from "axios";

const api_client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api_client.interceptors.request.use((config: any) => {
    const api_key = localStorage.getItem('api_key');
    if (api_key) {
        config.headers["x-api-key"] = api_key;
    }
    return config;
});

export default api_client;