import { NextResponse } from "next/server";
import { axiosWithAuth } from "@/utils/axiosWithAuth";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function GET() {
    try {
        const api = await axiosWithAuth();

        const response = await api.get("/identity/auth/me");

        return NextResponse.json(response.data);

    } catch (error) {
        return handleApiAxiosError(error);
    }
}