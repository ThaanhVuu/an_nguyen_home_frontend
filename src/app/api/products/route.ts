import {NextRequest, NextResponse} from "next/server";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";
import {axiosServer} from "@/libs/axios/axios.server";
import {Product} from "@/app/admin/product/useProducts";
import {axiosWithAuth} from "@/utils/axiosWithAuth";
import {Category} from "@/app/admin/category/useCategories";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const res = await axiosServer.get("/catalog/products", {params: searchParams});
        return NextResponse.json(res.data.data);
    } catch (e) {
        return handleApiAxiosError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: Product = await req.json();
        const api = await axiosWithAuth();
        const res = await api.post(`/catalog/products`, body);
        return NextResponse.json(res.data.data);
    } catch (e) {
        return handleApiAxiosError(e);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const api = await axiosWithAuth();
        const body: Category = await req.json();
        const res = await api.put(`/catalog/products/${body.id}`, body)
        return NextResponse.json(res.data);
    } catch (e) {
        return handleApiAxiosError(e);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body: string[] = await req.json();
        const api = await axiosWithAuth();
        const res = await api.delete(`/catalog/products`, {data: body});
        return NextResponse.json(res.data);
    } catch (e) {
        return handleApiAxiosError(e);
    }
}