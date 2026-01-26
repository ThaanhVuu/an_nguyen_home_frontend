import { NextResponse } from "next/server";
import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function GET(request: Request) {
    try {
        const api = await axiosWithAuth();
        const res = await api.get(`/order/orders`);
        return NextResponse.json(res.data);
    } catch (error) {
        handleApiAxiosError(error);
    }
}
