"use client";

import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 10000
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes("/refresh")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Gọi API refresh (URL thực tế: /api/refresh)
                await axiosClient.post("/refresh");

                // Refresh thành công, browser tự lưu cookie mới.
                // Xử lý các request đang đợi
                processQueue(null);

                // Gọi lại request ban đầu
                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);

                // Nếu refresh thất bại (hết hạn hẳn), logout user
                if (typeof window !== "undefined") {
                    // window.location.href = '/login'; // Bỏ comment dòng này khi muốn auto logout
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;