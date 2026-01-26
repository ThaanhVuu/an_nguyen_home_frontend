"use client";

import React, { useEffect, useState, Suspense } from "react";
import "./product.css";
import Card from "@/components/card/card";
import Link from "next/link";
import useProducts from "@/app/admin/product/useProducts";
import { Pagination } from "@/components/Pagination";
import ProductFilter from "@/app/admin/product/components/ProductFilter";
import useCategories from "@/app/admin/category/useCategories";
import FilterSidebar from "@/components/sidebar/FilterSidebar";
import { useSearchParams } from "next/navigation";

export default function ProductPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductContent />
        </Suspense>
    )
}

function ProductContent() {
    const {
        pagination,
        setPage,
        setFilterCategory,
        setFilterStatus,
        setPriceMin,
        setPriceMax,
        setKeyword,
        setSize,
        setSortBy,
        setSortOrder,
        products
    } = useProducts();
    const [tempSearch, setTempSearch] = useState<string>("")
    const [sortInputs, setSortInputs] = useState({
        sortBy: "createdAt",
        sortType: "asc" as "asc" | "desc"
    })
    const [filterInputs, setFilterInputs] = useState({
        category: "",
        priceFrom: "" as number | "",
        priceTo: "" as number | "",
        status: ""
    });
    const { categories: subCategories } = useCategories(1000, "hasParent");
    const searchParams = useSearchParams();

    // Sync URL params to State on mount or URL change
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        const keywordParam = searchParams.get("keyword");
        const priceFromParam = searchParams.get("priceFrom");
        const priceToParam = searchParams.get("priceTo");
        const sortParam = searchParams.get("sort"); // e.g. "price,asc"

        if (categoryParam) {
            setFilterCategory(categoryParam);
            setFilterInputs(prev => ({ ...prev, category: categoryParam }));
        }
        if (keywordParam) {
            setKeyword(keywordParam);
            setTempSearch(keywordParam);
        }
        if (priceFromParam) {
            setPriceMin(Number(priceFromParam));
            setFilterInputs(prev => ({ ...prev, priceFrom: Number(priceFromParam) }));
        }
        if (priceToParam) {
            setPriceMax(Number(priceToParam));
            setFilterInputs(prev => ({ ...prev, priceTo: Number(priceToParam) }));
        }
        if (sortParam) {
            const [field, order] = sortParam.split(",");
            if (field) setSortBy(field);
            if (order === "asc" || order === "desc") setSortOrder(order);
        }
    }, [searchParams]);

    const handleEnterKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setKeyword(tempSearch);
            setPage(0);
        }
    };

    const handleApplyFilter = () => {
        setFilterCategory(filterInputs.category);
        setFilterStatus(filterInputs.status);
        setPriceMin(filterInputs.priceFrom);
        setPriceMax(filterInputs.priceTo);
        setPage(0);
    };

    const handleResetFilter = () => {
        setFilterInputs({ category: "", priceFrom: "", priceTo: "", status: "" });
        setFilterCategory("");
        setFilterStatus("");
        setPriceMin("");
        setPriceMax("");
        setPage(0);
        // Optional: clear URL params
    };

    useEffect(() => {
        setSortBy(sortInputs.sortBy)
        setSortOrder(sortInputs.sortType)
    }, [sortInputs]);

    return (
        <div className="container">
            <nav aria-label="breadcrumb" className="mb-3" style={{ marginTop: "5rem" }}>
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link href="/" className="text-decoration-none text-dark">
                            Home
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        <a href="" className="text-decoration-none text-dark">
                            {" "}
                            Fridge
                        </a>
                    </li>
                </ol>
            </nav>

            <div className="row">
                <aside className="col-12 col-md-4 col-lg-3 d-flex flex-column gap-3">
                    <ProductFilter
                        tempSearch={tempSearch}
                        setTempSearch={setTempSearch}
                        handleEnterKeydown={handleEnterKeydown}
                        filterInputs={filterInputs}
                        setFilterInputs={setFilterInputs}
                        onApply={handleApplyFilter}
                        onReset={handleResetFilter}
                        subCategories={subCategories}
                        sortInputs={sortInputs}
                        setSortInput={setSortInputs}
                    />
                </aside>


                <div className="col-12 col-md-8 col-lg-9">
                    <div className="row g-4">
                        {products.map((item) => (
                            <div
                                key={item.id}
                                className="col-12 col-sm-6 col-lg-4"
                            >
                                <div className="product-card-wrapper">
                                    <Card
                                        product={item}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                pageSize={pagination.size}
                totalElements={pagination.totalElements}
                onPageChange={setPage}
                onSizeChange={(size) => {
                    setSize(size);
                    setPage(0);
                }}
            />
        </div>
    );
}
