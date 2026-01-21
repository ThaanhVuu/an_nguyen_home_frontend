import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {NextRequest, NextResponse} from "next/server";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function GET() {
    try {
        const api = await axiosWithAuth();
        const res = await api.get("/catalog/products");
        return NextResponse.json(res.data);
    } catch (e) {
        handleApiAxiosError(e);
    }
}