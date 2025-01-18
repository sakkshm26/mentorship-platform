import axios from "axios";

const api_client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
let is_refreshing = false;
let request_queue: any = [];

const processRequestQueue = (error: any, token = null) => {
    request_queue.forEach((request: any) => {
        if (error) {
            request.reject(error);
        } else {
            request.resolve(token);
        }
    });
    request_queue = [];
};

api_client.interceptors.request.use((config: any) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
});

api_client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.response.data?.error_type === "ACCESS_TOKEN_EXPIRED" && !originalRequest._retry) {
            if (is_refreshing) {
                try {
                    const token = await new Promise((resolve, reject) => {
                        request_queue.push({ resolve, reject });
                    });
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api_client(originalRequest);
                } catch (error) {
                    return Promise.reject(error);
                }
            }

            is_refreshing = true;
            try {
                const response = await api_client.post('/internal/user/auth/refresh', {
                    refresh_token: localStorage.getItem('refresh_token')
                });
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                const newAccessToken = response.data.access_token;
                is_refreshing = false;
                processRequestQueue(null, newAccessToken);
                originalRequest._retry = true;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api_client(originalRequest);
            } catch (error) {
                is_refreshing = false;
                processRequestQueue(error, null);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api_client;