import { NextResponse } from "next/server";
import { axiosWithAuth } from "@/utils/axiosWithAuth";
import { handleApiAxiosError } from "@/utils/handleApiAxiosError";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const api = await axiosWithAuth();
        // PUT /order/orders/{id}/status
        const res = await api.put(`/order/orders/${id}/status`, body);
        return NextResponse.json(res.data);
    } catch (error) {
        return handleApiAxiosError(error);
    }
}
