import {NextRequest, NextResponse} from "next/server";
import {axiosServerPublic} from "@/libs/axios/axios.server.public";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function GET(req: NextRequest){
    try {
        const params = req.nextUrl.searchParams;
        const response = await axiosServerPublic(`/catalog/categories`, {params: params})
        return NextResponse.json(response.data);
    }catch (e){
        handleApiAxiosError(e);
    }
}