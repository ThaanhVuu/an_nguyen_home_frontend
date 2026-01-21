"use client";

import Link from "next/link";
import "./card.css";
import AddToCartButton from "@/components/button/button";

type CardProps = {
  id: string | number;
  title: string;
  image: string;
  price: string;
  category: string;
};

export default function Card({ id, title, image, price, category }: CardProps) {
  return (
    <Link
      href={`/product-detail/${id}`}
      className="text-decoration-none text-dark"
    >
      <div className="card h-100 product-card">
        <img src={image} className="card-img-top" alt={title} />

        <div className="card-body d-flex flex-column">
          <h6 className="text-muted small mb-1">{category}</h6>
          <h6 className="card-title mb-2">{title}</h6>

          <div className="fw-bold text-danger mb-3">
            {Number(price).toLocaleString("vi-VN")} ₫
          </div>

          <div className="mt-auto">
            <AddToCartButton />
          </div>
        </div>
      </div>
    </Link>
  );
}
