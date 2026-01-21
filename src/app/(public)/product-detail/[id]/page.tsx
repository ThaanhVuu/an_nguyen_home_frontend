"use client";

import AddToCartButton from "@/components/button/button";
import { useState } from "react";


export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: 1,
    title: "Product #1",
    price: 160000,
    oldPrice: 199000,
    images: [
      "https://cdnv2.tgdd.vn/mwg-static/dmx/Products/Images/1943/321948/tu-lanh-aqua-660-lit-aqr-m727xagsu1-3-638610676556046960-700x467.jpg",
      "https://cdnv2.tgdd.vn/mwg-static/dmx/Products/Images/1943/321948/tu-lanh-aqua-660-lit-aqr-m727xagsu1-3-638610676556046960-700x467.jpg",
      "https://cdnv2.tgdd.vn/mwg-static/dmx/Products/Images/1943/321948/tu-lanh-aqua-660-lit-aqr-m727xagsu1-3-638610676556046960-700x467.jpg",
      "https://cdnv2.tgdd.vn/mwg-static/dmx/Products/Images/1943/321948/tu-lanh-aqua-660-lit-aqr-m727xagsu1-3-638610676556046960-700x467.jpg",
    ],
    category: "Kitchen Appliances",
    brand: "Happy Time",
    status: "In stock",
    description:
      "1.5L capacity, high power, stainless steel interior safe for health.",
    detailedDescription: `
      <h6 class="fw-bold mt-3 mb-2">Premium Quality Design</h6>
      <p>This product features a modern design with high-quality materials. The stainless steel interior ensures safety and durability for long-term use.</p>
      
      <h6 class="fw-bold mt-3 mb-2">Key Features</h6>
      <ul>
        <li>High power 1500W for quick heating</li>
        <li>1.5L large capacity suitable for family use</li>
        <li>Stainless steel 304 material - safe for health</li>
        <li>Auto shut-off when water boils</li>
        <li>Easy to clean and maintain</li>
      </ul>
      
      <h6 class="fw-bold mt-3 mb-2">Warranty & Support</h6>
      <p>Comes with 12 months warranty and dedicated customer support team ready to assist you.</p>
    `,
    specs: [
      { label: "Capacity", value: "1.5 liters" },
      { label: "Power", value: "1500W" },
      { label: "Material", value: "Stainless Steel 304" },
      { label: "Origin", value: "Vietnam" },
      { label: "Warranty", value: "12 months" },
    ],
  };

  return (
    <div className="container mt-4" style={{ marginTop: "5rem" }}>
      <div className="row g-5">
        <div className="col-12 col-md-6">
          <img
            src={product.images[selectedImage]}
            className="img-fluid rounded border"
            alt={product.title}
          />
          <div className="d-flex gap-2 mt-3">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`img-thumbnail ${selectedImage === index ? "border-primary border-3" : ""}`}
                alt={`${product.title} - ${index + 1}`}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  cursor: "pointer",
                  opacity: selectedImage === index ? 1 : 0.6,
                }}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h4 className="fw-bold mb-2">{product.title}</h4>

          <p className="mb-1">
            Category: <span className="text-primary">{product.category}</span>
          </p>

          <h3 className="text-danger fw-bold my-3">
            {product.price.toLocaleString("en-US")} ₫
            <span className="text-muted fs-6 text-decoration-line-through ms-2">
              {product.oldPrice.toLocaleString("en-US")} ₫
            </span>
          </h3>

          <p>
            Status:{" "}
            <span className="text-success fw-semibold">{product.status}</span>
          </p>

          <div className="d-flex align-items-center gap-2 my-3">
            <span>Quantity:</span>
            <button className="btn btn-outline-secondary btn-sm">-</button>
            <input
              type="text"
              className="form-control text-center"
              style={{ width: 60 }}
              value={1}
              readOnly
            />
            <button className="btn btn-outline-secondary btn-sm">+</button>
          </div>

          <div className="d-flex gap-3 mt-4">
            <AddToCartButton/>
            <button className="btn btn-outline-secondary px-4">Buy Now</button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h5 className="fw-bold mb-3">Technical Specifications</h5>

        <table className="table table-bordered">
          <tbody>
            {product.specs.map((item, index) => (
              <tr key={index}>
                <th style={{ width: "30%" }}>{item.label}</th>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <h5 className="fw-bold mb-3">Product Description</h5>
        <div
          className="p-3 border rounded"
          dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
        />
      </div>
    </div>
  );
}
