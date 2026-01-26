import {NextRequest, NextResponse} from "next/server";
import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function POST(req: NextRequest ) {
    try {
        const api = await axiosWithAuth();
        const payload = await req.json();
        const res = await api.post("/identity/auth/register", payload);

        return NextResponse.json(res.data);
    } catch (err) {
        return handleApiAxiosError(err)
    }
}
