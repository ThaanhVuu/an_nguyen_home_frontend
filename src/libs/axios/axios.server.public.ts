import axios from "axios";

export const axiosServerPublic = axios.create({
    baseURL: process.env.BACKEND_URL,
    timeout: 10000
});
