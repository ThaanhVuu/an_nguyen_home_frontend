"use client";
import "./shopping_cart.css";

import { ShoppingCart } from "lucide-react";
import AddToCartButton from "@/components/button/button";
import InputCus from "../input/InputCus";
export default function ShoppingCartItem() {
  return (
    <div className="container">
      <div className="row">

        <div className="col-lg-8">
          <div className="cart-list d-flex flex-column gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="cart-item  d-flex align-items-center justify-content-between p-3 rounded-3 shadow"
              >
                <div className="d-flex align-items-center gap-3 margin-top">
                  <input type="checkbox" defaultChecked />

                  <img
                    src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-16.jpg"
                    alt="product"
                    className="cart-image"
                  />

                  <div>
                    <div className="fw-semibold">Sản phẩm #{index + 1}</div>
                    <div className="text-muted small">
                      Model: abc{index + 1}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-light border">−</button>
                  <span className="px-2">1</span>
                  <button className="btn btn-light border">+</button>
                </div>

                <div className="text-end">
                  <div className="fw-bold text-danger">9.000.000 ₫</div>
                  <div className="text-muted text-decoration-line-through small">
                    10.000.000 ₫
                  </div>
                </div>

                <button className="btn btn-link text-muted ms-3">🗑</button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div>
            <section className="card h-100 rounded-3 shadow-sm card-hover">
              <section className="p-3">
                <div>
                  <div>
                    <h5>Tóm Tắt đơn hàng </h5>
                    <p>
                      tạm tính<span className="p-5">9999</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      tạm tính<span className="p-5">9999</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      tạm tính<span className="p-5">9999</span>
                    </p>
                  </div>
                </div>
                <hr className="my-3" />

                <div>
                  <div>
                    <h6>Mã giảm giá</h6>

                    <div className="d-flex gap-3">
                      <InputCus
                        className="form-control-sm flex-grow-1"
                        placeholder="Nhập mã giảm giá"
                      />
                      <button className="btn btn-outline-secondary btn-sm">
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="card-body d-flex flex-column">
                <span className="fw-semibold mb-2">
                </span>

                <div className="mt-auto ">
                  <button
                    type="button"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2   "
                  >
                    <ShoppingCart size={18} />
                    <span>Tiến hành thanh toán &rarr;</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
