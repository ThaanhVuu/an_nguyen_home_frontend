"use client";

import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 10000
});

axiosClient.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default axiosClient;
