"use client";

import { useState } from "react";
import "./product.css";
import Card from "@/components/card/card";
import Footer from "@/components/Footer/footer";
import FilterSidebar from "@/components/sidebar/FilterSidebar";
import Link from "next/link";

export default function ProductPage() {
  const products = Array.from({ length: 145 }); 
  const ITEMS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="container">
      <nav aria-label="breadcrumb" className="mb-3">
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
        <FilterSidebar />

        <div className="col-12 col-md-8 col-lg-9">
          <div className="row g-4">
            {currentProducts.map((_, index) => (
              <div
                key={startIndex + index}
                className="col-12 col-sm-6 col-lg-4"
              >
                <div className="product-card-wrapper">
                  <Card
                    id={startIndex + index + 1}
                    title={`Product #${startIndex + index + 1}`}
                    image="https://cdnv2.tgdd.vn/mwg-static/dmx/Products/Images/1943/321948/tu-lanh-aqua-660-lit-aqr-m727xagsu1-3-638610676556046960-700x467.jpg"
                    price="9999999"
                    category="Fridge"
                  />
                </div>
              </div>
            ))}
          </div>

          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </button>
              </li>

              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  ›
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <>
        <Footer />
      </>
    </div>
  );
}
