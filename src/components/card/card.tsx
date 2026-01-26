"use client";

import Link from "next/link";
import "./card.css";
import AddToCartButton from "@/components/button/button";
import {Product} from "@/app/admin/product/useProducts";

export default function Card({product}: { product: Product }) {
    return (
        <Link
            href={`/product-detail/${product.id}`}
            className="text-decoration-none text-dark"
        >
            <div className="card h-100 product-card">
                <img src={product.images?.[0]?.imageUrl || "https://via.placeholder.com/300"} className="card-img-top"
                     alt={product.images?.[0]?.altText || "Product"}/>

                <div className="card-body d-flex flex-column">
                    <h6 className="text-muted small mb-1">{product.categoryName}</h6>
                    <h6 className="card-title mb-2">{product.name}</h6>

                    <div className="fw-bold text-danger mb-3">
                        {Number(product.price).toLocaleString("vi-VN")} ₫
                    </div>

                    <div className="mt-auto">
                        <AddToCartButton product={product}/>
                    </div>
                </div>
            </div>
        </Link>
    );
}
