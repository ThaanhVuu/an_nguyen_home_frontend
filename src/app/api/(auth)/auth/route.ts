import axios from "axios";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";
import {parse} from "set-cookie-parser";

export async function POST(req: Request) {
    try {
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

        const setCookieHeader = res.headers[`set-cookie`];
        if (setCookieHeader) {
            const parsedCookie = parse(setCookieHeader);
            parsedCookie.forEach(cookie => {
                cookieStore.set({
                    name: cookie.name,
                    value: cookie.value,
                    path: cookie.path || "/", // Ưu tiên path của backend, fallback về "/"
                    httpOnly: cookie.httpOnly, // Lấy theo backend
                    secure: cookie.secure,     // Lấy theo backend
                    maxAge: cookie.maxAge,     // Thời gian sống (giây)
                    expires: cookie.expires,   // Thời điểm hết hạn (Date)
                    sameSite: cookie.sameSite as "strict" | "lax" | "none" // Ép kiểu cho Next.js
                })
            })
        }

        return NextResponse.json({message: res.data.message});
    } catch (err) {
        return handleApiAxiosError(err);
    }
}
