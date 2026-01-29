import { NextResponse } from "next/server";
import { axiosWithAuth } from "@/utils/axiosWithAuth";
import { handleApiAxiosError } from "@/utils/handleApiAxiosError";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const api = await axiosWithAuth();
        // POST /payments/{orderId}/confirm
        const res = await api.post(`/payments/${id}/confirm`);
        return NextResponse.json(res.data);
    } catch (error) {
        return handleApiAxiosError(error);
    }
}
