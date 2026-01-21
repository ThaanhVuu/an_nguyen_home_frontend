"use client"

import {useEffect, useState} from "react";
import AxiosClient from "@/libs/axios/axios.client";
import axiosClient from "@/libs/axios/axios.client";
import {AxiosError} from "axios";
import {error} from "next/dist/build/output/log";

export interface Category {
    id: string;
    isActive: boolean;
    name: string;
    parentId: string | null;
    parentName: string | number;
    slug: string;

}

export interface PaginationData {
    data: Category[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export type CategoryFilterType = "root" | "hasParent" | null | string;

interface CategoryParams {
    page: number;
    size: number;
    filter?: string;
    parentId?: string;
    keyword?: string;
}

function useCategories() {
// State quản lý Params
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [filter, setFilter] = useState<CategoryFilterType>(null);
    const [keyword, setKeyword] = useState<string>(""); // Thêm state keyword

    // State kết quả
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [rootCategories, setRootCategories] = useState<Category[]>([]);

    //State trigger update ket qua
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const insertCategory = async (input: Category) => {
        try {
            setLoading(true);
            const res = await AxiosClient.post("/categories", input);

            setRefreshTrigger(prev => prev + 1);

            return res.data;
        } catch (err: any) {
            throw (err);
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (input: Category) => {
        try {
            setLoading(true);
            const res = await AxiosClient.put(`/categories`, input);

            setRefreshTrigger(prev => prev + 1);
            console.log(res);
            return res.data;
        } catch (err: any) {
            throw (err);
        } finally {
            setLoading(false);
        }
    }

    const deleteCategory = async (ids: (number | string)[]) => {
        try {
            setLoading(true);
            await AxiosClient.delete(`/categories`, {data: ids});
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

                const params: CategoryParams = {page, size};
                if (filter != null && filter != "") {
                    params.filter = filter;
                }
                if (keyword != null && keyword != "") {
                    params.keyword = keyword;
                }

                const response = await AxiosClient.get("/categories", {params})

                const result: PaginationData = response.data?.data;

                if (result) {
                    setCategories(result.data || []);
                    setTotalPages(result.totalPages);
                    setTotalElements(result.totalElements);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetch().then();

    }, [filter, size, page, keyword, refreshTrigger]);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get("/categories/root");
                console.log(response.data)
                setRootCategories(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        fetch().then();
    }, [refreshTrigger]);

    return {
        categories,
        loading,
        pagination: {
            page,       // Trả về state Input để UI hiển thị đang ở trang nào
            size,
            totalPages, // Trả về Output để UI biết có bao nhiêu trang
            totalElements
        },
        setPage,   // UI dùng hàm này để chuyển trang
        setSize,
        setFilter,
        setKeyword,
        rootCategories,
        insertCategory,
        updateCategory,
        deleteCategory
    };
}

export default useCategories