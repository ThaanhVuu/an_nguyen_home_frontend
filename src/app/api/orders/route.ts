import { NextResponse } from "next/server";
import { axiosWithAuth } from "@/utils/axiosWithAuth";
import { handleApiAxiosError } from "@/utils/handleApiAxiosError";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const api = await axiosWithAuth();
        const res = await api.get(`/order/orders`,{params: searchParams});
        return NextResponse.json(res.data);
    } catch (error) {
        return handleApiAxiosError(error);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const api = await axiosWithAuth();
        const res = await api.post("order/orders", body)
        return NextResponse.json(res.data);
    } catch (e) {
        return handleApiAxiosError(e);
    }
}
