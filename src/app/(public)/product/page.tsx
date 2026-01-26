"use client";

import React from "react";
import "./product.css";
import Card from "@/components/card/card";
import FilterSidebar from "@/components/sidebar/FilterSidebar";
import Link from "next/link";
import useProducts from "@/app/admin/product/useProducts";
import {Pagination} from "@/components/Pagination";

export default function ProductPage() {
    const {pagination, setPage, setSize, products} = useProducts();

    return (
        <div className="container">
            <nav aria-label="breadcrumb" className="mb-3" style={{marginTop: "5rem"}}>
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
                <FilterSidebar/>

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
