import { NextResponse } from "next/server";
import { axiosWithAuth } from "@/utils/axiosWithAuth";
import { handleApiAxiosError } from "@/utils/handleApiAxiosError";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const api = await axiosWithAuth();
        // POST /payments/{orderId}/record with body { amount, transactionId }
        const res = await api.post(`/payments/${id}/record`, body);
        return NextResponse.json(res.data);
    } catch (error) {
        return handleApiAxiosError(error);
    }
}
