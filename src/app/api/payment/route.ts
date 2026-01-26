import {NextRequest, NextResponse} from "next/server";
import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function POST(req: NextRequest){
    try{
        const api = await axiosWithAuth();
        const payload = req.json();
        const res = await api.post(`/order/orders`, payload);
        return NextResponse.json(res.data)
    }catch (e){
        return handleApiAxiosError(e);
    }
}