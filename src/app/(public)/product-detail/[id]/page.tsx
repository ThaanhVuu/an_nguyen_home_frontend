"use client";

import { useState } from "react";
import AddToCartButton from "@/components/button/button";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: "69741c1c2935307a947505f1",
    categoryId: "69736afffbb7ac2aad8aa26c",
    categoryName: "Laptop",
    name: "Asus Tuf 15 506HM",
    slug: "asus-tuf-15-506hm",
    description: `<div id="cpsContentSEO">
  <h2><strong>Laptop ASUS TUF Gaming F15 FX506HM-HN018T - Đẳng cấp chiến binh</strong></h2>

  <p><strong>Laptop Asus TUF Gaming F15 FX506HM-HN018T</strong>
  là một trong những laptop gaming có hiệu năng vượt trội cùng thiết kế ấn tượng...</p>

  <h3><strong>Thiết kế thanh thoát, thân thiện với game thủ</strong></h3>

  <p>Thiết kế mạnh mẽ với các sọc đỏ, tấm gia cường hình lục giác...</p>

  <p align="center">
    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:100/p…g/laptop/Laptop-Asus-TUF-Gaming-F15-FX506HM-HN018T-1_1_.jpg" />
  </p>

  <h3><strong>Hiệu năng cực đỉnh, tản nhiệt ổn định</strong></h3>

  <p>Trang bị CPU Intel Core i5, GPU RTX 3060, SSD NVMe...</p>

  <p align="center">
    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:100/p…g/laptop/Laptop-Asus-TUF-Gaming-F15-FX506HM-HN018T-2_1_.jpg" />
  </p>

  <h2><strong>Mua ngay laptop Asus TUF Gaming F15 giá tốt</strong></h2>

  <p>Hiện tại sản phẩm đang được phân phối chính hãng...</p>
</div>`,
    specifications: {
      RAM: "16GB",
      CPU: "i7 11800H",
      GPU: "RTX 3060 3GB",
      SSD: "512GB",
      Monitor: "144Hz",
      Pin: "90000 MAH",
    },
    price: 23000000,
    discount: 1000000,
    quantity: 99,
    isActive: true,
    images: [
      {
        imageUrl:
          "https://cdn.tgdd.vn/Products/Images/44/317709/asus-tuf-gaming-f15-fx507zc4-i5-hn229w-hinh-1-750x500.jpg",
        altText: "asus tuf f15",
      },
      {
        imageUrl:
          "https://cdn.tgdd.vn/Products/Images/44/317709/asus-tuf-gaming-f15-fx507zc4-i5-hn229w-hinh-1-750x500.jpg",
        altText: "asus tuf f15",
      },
    ],
  };

  const finalPrice = product.price - product.discount;

  return (
    <div className="container mt-5">
  
      <div className="row g-4">
    
        <div className="col-md-6">
          <img
            src={product.images[selectedImage].imageUrl}
            alt={product.images[selectedImage].altText}
            className="img-fluid border rounded"
          />

          <div className="d-flex gap-2 mt-3">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl}
                alt={img.altText}
                onClick={() => setSelectedImage(index)}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    selectedImage === index
                      ? "2px solid #0d6efd"
                      : "1px solid #ccc",
                }}
              />
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h3 className="fw-bold">{product.name}</h3>

          <p className="text-muted">
            Category: <strong>{product.categoryName}</strong>
          </p>

          <h4 className="text-danger fw-bold">
            {finalPrice.toLocaleString("vi-VN")} ₫
            <span className="text-muted fs-6 text-decoration-line-through ms-2">
              {product.price.toLocaleString("vi-VN")} ₫
            </span>
          </h4>

          <p>
            Status:{" "}
            <span className="fw-semibold text-success">
              {product.isActive ? "In stock" : "Out of stock"}
            </span>
          </p>

          <p>Available quantity: {product.quantity}</p>

          <div className="d-flex gap-3 mt-3">
            <AddToCartButton />
            <button className="btn btn-outline-secondary">Buy Now</button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h5 className="fw-bold mb-3">Technical Specifications</h5>

        <table className="table table-bordered">
          <tbody>
            {Object.entries(product.specifications).map(([key, value]) => (
              <tr key={key}>
                <th style={{ width: "30%" }}>{key}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <h5 className="fw-bold mb-3">Product Description</h5>
        <div
          className="border rounded p-3"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
