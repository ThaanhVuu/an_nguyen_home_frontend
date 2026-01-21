import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export function handleApiAxiosError(err: unknown) {
    if (err instanceof AxiosError) {
        console.error("BACKEND ERROR:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url,
            method: err.config?.method,
        });

        return NextResponse.json(
            {
                message: err.response?.data?.message ?? "Request failed",
                details: err.response?.data,
            },
            {
                status: err.response?.status ?? 500,
            }
        );
    }

    console.error("UNKNOWN ERROR:", err);

    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
}
