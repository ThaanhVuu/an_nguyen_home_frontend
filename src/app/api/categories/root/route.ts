import {NextResponse} from "next/server";
import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function GET(){
    try {
        const api = await axiosWithAuth();
        const res = await api.get("/catalog/categories?filter=root&size=2000")
        return NextResponse.json(res.data.data.data);
    }catch (e){
        return handleApiAxiosError(e);
    }
}