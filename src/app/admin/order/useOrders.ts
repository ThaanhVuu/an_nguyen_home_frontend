"use client"

import { useEffect, useState } from "react";
import AxiosClient from "@/libs/axios/axios.client";
import { PaginationData } from "@/types/pagination";

export interface OrderItemResponse {
    id: string;
    productId: string;
    productName: string | null;
    quantity: number;
    currencyPrice: number;
}

export interface OrderResponse {
    id: string;
    userId: string;
    clientRequestId: string;
    status: string;
    totalAmount: number;
    shippingFee: number;
    shippingName: string;
    shippingPhone: string;
    shippingEmail: string;
    shippingAddress: string;
    orderItems: OrderItemResponse[];
    createdAt: string;
    paidAmount?: number;
    cancelReason?: string;
    cancelNote?: string;
}

export type OrderStatus = "PENDING" | "PENDING_PAYMENT" | "CONFIRMED_PAYMENT" | "SHIPPING" | "COMPLETED" | "CANCELLED";

interface OrderParams {
    page: number;
    size: number;
    keyword?: string;
    statusStrings?: string | null;
    // fromDate, toDate can be added later
}

function useOrders(initSize?: number) {
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(initSize || 10);
    const [keyword, setKeyword] = useState<string>("");
    const [status, setStatus] = useState<string | null>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const cancelOrder = async (orderId: string, reason: string) => {
        try {
            setLoading(true);
            await AxiosClient.post(`/orders/${orderId}/cancel`, { reason });
            setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
            throw (err);
        } finally {
            setLoading(false);
        }
    }

    // Admin confirm payment
    const confirmPayment = async (orderId: string) => {
        try {
            setLoading(true);
            await AxiosClient.post(`/payments/${orderId}/confirm`);
            setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
            throw (err);
        } finally {
            setLoading(false);
        }
    }

    const recordPayment = async (orderId: string, amount: number, transactionId: string) => {
        try {
            setLoading(true);
            await AxiosClient.post(`/payments/${orderId}/record`, { amount, transactionId });
            setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
            throw (err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);

                const params: OrderParams = { page, size };
                if (keyword) params.keyword = keyword;
                if (status) params.statusStrings = status;

                // Adjust endpoint to match backend.
                // Based on `api/orders/route.ts` calling `/order/orders`, for generic list.
                // If it's admin getting ALL orders, it likely hits the same endpoint but allowed for admin role.
                const response = await AxiosClient.get("/orders", { params });

                const result: PaginationData<OrderResponse> = response.data?.data || response.data;
                // Check if result is directly the pagination object or wrapped in `data`
                // `Category` hook used response.data?.data

                if (result) {
                    setOrders(result.data || []);
                    setTotalPages(result.totalPages);
                    setTotalElements(result.totalElements);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetch().then();

    }, [page, size, keyword, status, refreshTrigger]);

    return {
        orders,
        loading,
        pagination: {
            page,
            size,
            totalPages,
            totalElements
        },
        setPage,
        setSize,
        setKeyword,
        setStatus,
        cancelOrder,
        confirmPayment,
        recordPayment,
        refresh: () => setRefreshTrigger(prev => prev + 1)
    };
}

export default useOrders;
