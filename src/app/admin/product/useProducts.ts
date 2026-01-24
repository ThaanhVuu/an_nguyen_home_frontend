"use client"
import { useEffect, useState } from "react";
import AxiosClient from "@/libs/axios/axios.client";
import { PaginationData } from "@/types/pagination";

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    categoryName?: string;
    price: number;
    discount?: number;
    quantity: number;
    isActive: boolean;
    images?: ProductImage[];
    specifications?: Record<string, any>;
}

export interface ProductImage {
    imageUrl: string;
    publicId?: string;
    altText?: string;
    displayOrder?: number;
    isThumbnail?: boolean;
}

export interface ProductParams {
    page: number;
    size: number;
    keyword?: string;
    filter?: string; // Chuỗi định dạng: "key:value,key:value"
    sort?: string;   // Chuỗi định dạng: "field,asc|desc"
}

export default function useProducts() {
    // --- STATE QUẢN LÝ PARAMETERS (Input từ UI) ---
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [keyword, setKeyword] = useState<string>("");

    // State riêng cho từng bộ lọc (để UI dễ binding)
    const [filterCategory, setFilterCategory] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>(""); // "active" | "inactive" | ""
    const [priceMin, setPriceMin] = useState<number | "">("");
    const [priceMax, setPriceMax] = useState<number | "">("");

    // State cho Sort
    const [sortBy, setSortBy] = useState<string>("createdDate"); // Default sort
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // --- STATE KẾT QUẢ (Output ra UI) ---
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);

    // Pagination Metadata
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    // Trigger để reload lại dữ liệu khi CUD xong
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // --- ACTIONS (CUD) ---

    const insertProduct = async (input: {
        id: string;
        name: string;
        slug: string;
        description?: string;
        categoryId: string;
        categoryName?: string;
        price: number;
        discount?: number;
        quantity: number;
        isActive: boolean;
        images?: ProductImage[];
        specifications: Record<string, string>
    }) => {
        try {
            setLoading(true);
            console.log(input)
            const res = await AxiosClient.post("/products", input);
            setRefreshTrigger((prev) => prev + 1);
            return res.data;
        } catch (err: any) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (input: {
        id: string;
        name: string;
        slug: string;
        description?: string;
        categoryId: string;
        categoryName?: string;
        price: number;
        discount?: number;
        quantity: number;
        isActive: boolean;
        images?: ProductImage[];
        specifications: Record<string, any>;
    }) => {
        try {
            setLoading(true);
            // Giả sử API update là PUT /products (hoặc /products/{id})
            const res = await AxiosClient.put(`/products`, input);
            setRefreshTrigger((prev) => prev + 1);
            return res.data;
        } catch (err: any) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (ids: string[]) => {
        try {
            setLoading(true);
            // Giả sử API delete nhận body là mảng ids
            await AxiosClient.delete("/products", { data: ids });
            setRefreshTrigger((prev) => prev + 1);
        } catch (err: any) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // --- FETCH DATA EFFECT ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // 1. Xây dựng chuỗi Filter string theo quy ước Backend (key:value,key:value)
                const filterParts = [];

                if (filterCategory) {
                    filterParts.push(`category:${filterCategory}`);
                }

                if (filterStatus) {
                    filterParts.push(`active:${filterStatus}`);
                }

                if (priceMin !== "") {
                    filterParts.push(`priceFrom:${priceMin}`);
                }

                if (priceMax !== "") {
                    filterParts.push(`priceTo:${priceMax}`);
                }

                // 2. Chuẩn bị Params gửi đi
                const params: ProductParams = {
                    page,
                    size,
                    keyword: keyword || undefined,
                    filter: filterParts.length > 0 ? filterParts.join(",") : undefined,
                    sort: `${sortBy},${sortOrder}` // Spring Data Sort Format
                };

                const response = await AxiosClient.get("/products", { params });
                const result: PaginationData<Product> = response.data;

                if (result) {
                    setProducts(result.data || []);
                    setTotalPages(result.totalPages);
                    setTotalElements(result.totalElements);
                } else {
                    // Fallback nếu không có data
                    setProducts([]);
                    setTotalPages(0);
                    setTotalElements(0);
                }

            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts().then();

    }, [
        page, size, keyword,
        filterCategory, filterStatus, priceMin, priceMax,
        sortBy, sortOrder,
        refreshTrigger
    ]);

    // Return tất cả state và handler cần thiết cho UI
    return {
        // Data
        products,
        loading,
        pagination: {
            page,
            size,
            totalPages,
            totalElements,
        },

        // State Setters (để UI binding vào input/select)
        setPage,
        setSize,
        setKeyword,

        // Filter Setters
        setFilterCategory,
        setFilterStatus,
        setPriceMin,
        setPriceMax,

        // Sort Setters
        setSortBy,
        setSortOrder,

        // Actions
        insertProduct,
        updateProduct,
        deleteProduct,

        // Manual Reload nếu cần
        refresh: () => setRefreshTrigger(prev => prev + 1)
    };
}