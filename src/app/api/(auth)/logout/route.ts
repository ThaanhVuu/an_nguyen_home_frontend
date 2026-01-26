import { NextResponse } from "next/server";
import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";
import {cookies} from "next/headers";

export async function POST( ) {
    try {
        const api = await axiosWithAuth();
        await api.post("/identity/auth/logout");

        const cookieStore = await cookies(); // ✅ BẮT BUỘC await
        cookieStore.delete("access_token");

        return NextResponse.json({status: 200});
    } catch (err) {
        return handleApiAxiosError(err)
    }
}
