"use client";

import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";

const axiosClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 10000
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
        const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (err.response?.status === 401 && !originalRequest._retry) {

            // 1. Nếu đang có một request khác đang refresh token, thì request này xếp hàng đợi
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        // Khi queue được giải quyết, gọi lại request cũ
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            // 2. Đánh dấu request này đã retry để tránh lặp vô hạn
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 3. Gọi API Refresh (Route này gọi sang Next.js Server -> Backend)
                // Lưu ý: Đường dẫn này phải khớp với file route.ts bạn vừa tạo
                await axiosClient.post("/refresh");

                // 4. Nếu thành công -> Xử lý hàng đợi
                processQueue(null);

                // 5. Gọi lại request ban đầu bị lỗi
                return axiosClient(originalRequest);
            } catch (refreshErr) {
                // 6. Nếu refresh cũng lỗi (Token hết hạn hẳn hoặc bị revoke)
                processQueue(refreshErr, null);

                // Redirect về login
                window.location.href = "/login";
                return Promise.reject(refreshErr);
            } finally {
                // Reset trạng thái
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default axiosClient;
