import {NextRequest, NextResponse} from "next/server";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";
import {axiosServerPublic} from "@/libs/axios/axios.server.public";
import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {Category} from "@/app/admin/category/useCategories";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const response = await axiosServerPublic.get("/catalog/categories", {
            params: searchParams // Axios tự động xử lý URLSearchParams
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return handleApiAxiosError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const api = await axiosWithAuth();
        const body = await req.json();
        const response = await api.post("/catalog/categories", body);
        return NextResponse.json(response.data);
    } catch (e) {
        return handleApiAxiosError(e);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const api = await axiosWithAuth();
        const body: Category = await req.json();
        const res = await api.put(`/catalog/categories/${body.id}`, body)
        return NextResponse.json(res.data);
    } catch (e) {
        return handleApiAxiosError(e);
    }
}

export async function DELETE(req: NextRequest ) {
    try {
        const api = await axiosWithAuth();
        const body = await req.json();
        const response = await api.delete(`/catalog/categories`, {data: body});
        return NextResponse.json(response.data);
    }catch (e){
        return handleApiAxiosError(e);
    }
}