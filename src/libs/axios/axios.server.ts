import axios from "axios";

export const axiosServer = axios.create({
    baseURL: process.env.BACKEND_URL,
    timeout: 10000
});
