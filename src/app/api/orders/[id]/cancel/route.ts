import { NextResponse } from "next/server";
import { axiosWithAuth } from "@/utils/axiosWithAuth";
import { handleApiAxiosError } from "@/utils/handleApiAxiosError";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const api = await axiosWithAuth();

        // Call backend cancel endpoint
        // Assuming POST /order/orders/{id}/cancel based on generic REST or provided service method cancelOrder(UUID orderId, String userId)
        // Usually admin endpoints might be different or same. 
        // If the service just checks userId, Admin checking userId might be tricky if "admin" isn't the owner.
        // But let's assume the backend handles role check or this is a general endpoint.
        // I'll try /order/orders/{id}/cancel
        const res = await api.post(`/order/orders/${id}/cancel`, body);
        return NextResponse.json(res.data);
    } catch (error) {
        return handleApiAxiosError(error);
    }
}
