import axios, {AxiosError} from "axios";
import { cookies } from "next/headers";
import {NextResponse} from "next/server";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function POST(req: Request) {
    try{
        const body = await req.json();

        const res = await axios.post(
            `${process.env.BACKEND_URL}/identity/auth/login`,
            body
        );

        const cookieStore = await cookies(); // ✅ BẮT BUỘC await

        cookieStore.set("access_token", res.data.data, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/"
        });

        return NextResponse.json({ message: res.data.message });
    }catch (err) {
        return handleApiAxiosError(err);
    }
}
