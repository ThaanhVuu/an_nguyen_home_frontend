import { NextResponse} from "next/server";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";
import {cookies} from "next/headers";
import {parse} from "set-cookie-parser";
import {axiosServer} from "@/libs/axios/axios.server";

export async function POST(){
    try{
        const cookieStore = await cookies();

        const refreshToken = cookieStore.get("refresh_token");

        if (!refreshToken) {
            return NextResponse.json(
                { message: "Refresh token not found" },
                { status: 401 }
            );
        }

        const res = await axiosServer.post("/identity/auth/refresh", {}, {
            headers: {
                Cookie: `refresh_token=${refreshToken.value}`
            }
        });

        if (res.data.data) { // Tuỳ cấu trúc response của bạn
            cookieStore.set("access_token", res.data.data, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });
        }

        const setCookieHeader = res.headers['set-cookie'];
        if (setCookieHeader) {
            const parsedCookies = parse(setCookieHeader);
            parsedCookies.forEach(cookie => {
                cookieStore.set({
                    name: cookie.name,
                    value: cookie.value,
                    path: cookie.path || "/",
                    httpOnly: cookie.httpOnly,
                    secure: cookie.secure,
                    maxAge: cookie.maxAge,
                    expires: cookie.expires,
                    sameSite: cookie.sameSite as "strict" | "lax" | "none"
                });
            });
        }
        return NextResponse.json(res.data.message);
    }catch (e){
        return handleApiAxiosError(e);
    }
}