import {NextResponse} from 'next/server';
import {axiosServerPublic} from "@/libs/axios/axios.server.public";
import {handleApiAxiosError} from "@/utils/handleApiAxiosError";

export async function GET(
    request: Request,
    props: {params: Promise<{ id: string }>}
) {
    try {
        const {id} = await props.params;
        console.log(id)
        const res = await axiosServerPublic.get(`/catalog/products/${id}`);

        return NextResponse.json(res.data.data);
    } catch (e: any) {
        return handleApiAxiosError(e)
    }
}