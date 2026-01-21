import { cookies } from "next/headers";
import { axiosServer } from "@/libs/axios/axios.server";

export async function axiosWithAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    return axiosServer.create({
        headers: token
            ? {
                Authorization: `Bearer ${token}`
            }
            : {}
    });
}
