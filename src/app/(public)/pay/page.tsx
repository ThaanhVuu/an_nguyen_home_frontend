"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function CheckoutPage() {
  const router = useRouter();

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "qr">(
    "card",
  );

  const handleOrder = () => {
    alert("Đặt hàng thành công!");
    router.push("/");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        {/* 1. customer info */}
        <section className="card">
          <div className="card-title">
            <span className="step">1</span>
            <h3>Thông tin khách hàng</h3>
            <span className="login">
              Đã có tài khoản? <b>Đăng nhập</b>
            </span>
          </div>

          <div className="form-grid">
            <div className="form-group full">
              <label>Email</label>
              <input placeholder="Email" />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input placeholder="Số điện thoại" />
            </div>

            <div className="form-group">
              <label>Họ và tên</label>
              <input placeholder="Họ và tên" />
            </div>
          </div>
        </section>

        {/* 2. shipping address */}
        <section className="card">
          <div className="card-title">
            <span className="step">2</span>
            <h3>Địa chỉ giao hàng</h3>
          </div>

          <div className="form-grid">
            <div className="form-group full">
              <label>Địa chỉ đường</label>
              <input placeholder="Số nhà, tên đường" />
            </div>

            <div className="form-group">
              <label>Tỉnh / Thành phố</label>
              <select>
                <option>Chọn tỉnh / thành phố</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quận / Huyện</label>
              <select>
                <option>Chọn quận / huyện</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phường / Xã</label>
              <select>
                <option>Chọn phường / xã</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ghi chú (tuỳ chọn)</label>
              <input placeholder="Ghi chú cho người giao hàng" />
            </div>
          </div>
        </section>

        {/* 3. shipping method */}
        <section className="card">
          <div className="card-title">
            <span className="step">3</span>
            <h3>Phương thức giao hàng</h3>
          </div>

          <div
            className={`option ${
              shippingMethod === "standard" ? "active" : ""
            }`}
            onClick={() => setShippingMethod("standard")}
          >
            <div>
              <b>Giao hàng tiêu chuẩn</b>
              <p>3–5 ngày làm việc</p>
            </div>
            <span className="free">Miễn phí</span>
          </div>

          <div
            className={`option ${shippingMethod === "express" ? "active" : ""}`}
            onClick={() => setShippingMethod("express")}
          >
            <div>
              <b>Giao hàng hỏa tốc</b>
              <p>1–2 ngày làm việc</p>
            </div>
            <span>50.000đ</span>
          </div>
        </section>

        {/* 4. payment */}
        <section className="card">
          <div className="card-title">
            <span className="step">4</span>
            <h3>Phương thức thanh toán</h3>
          </div>

          {/* card */}
          <div
            className={`option column ${
              paymentMethod === "card" ? "active" : ""
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <div className="payment-header">
              <div className="payment-title">
                <b>Thẻ tín dụng / Ghi nợ</b>
                <p>Thanh toán an toàn qua Visa, Mastercard</p>
              </div>

              <div className="payment-logos">
                <span className="badge visa">VISA</span>
                <span className="badge mc">MC</span>
              </div>
            </div>

            {paymentMethod === "card" && (
              <>
                <input className="card-input full" placeholder="Số thẻ" />

                <div className="card-input-row">
                  <input placeholder="MM / YY" />
                  <input placeholder="Mã CVC" />
                </div>
              </>
            )}
          </div>

          {/* cod */}
          <div
            className={`option ${paymentMethod === "cod" ? "active" : ""}`}
            onClick={() => setPaymentMethod("cod")}
          >
            <b>Thanh toán khi nhận hàng (COD)</b>
          </div>

          {/* qr */}
          <div
            className={`option ${paymentMethod === "qr" ? "active" : ""}`}
            onClick={() => setPaymentMethod("qr")}
          >
            <b>Quét QR</b>
            <p>STK: 83868386 – VCB – AN NGUYEN STORE</p>
          </div>
        </section>
      </div>

      {/* right summary */}
      <aside className="checkout-right card">
        <h3 className="summary-title">Tóm tắt đơn hàng</h3>

        <div className="summary-product">
          <img src="https://picsum.photos/80" />
          <div className="info">
            <b>Robot hút bụi X1</b>
            <span>Trắng</span>
            <small>SL: 1</small>
          </div>
          <span className="price">5.000.000đ</span>
        </div>

        <div className="summary-product">
          <img src="https://picsum.photos/81" />
          <div className="info">
            <b>Máy lọc không khí Pro</b>
            <span>Bạc</span>
            <small>SL: 1</small>
          </div>
          <span className="price">3.200.000đ</span>
        </div>

        <hr />

        <div className="summary-row">
          <span>Tạm tính</span>
          <span>8.200.000đ</span>
        </div>

        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span className="free">Miễn phí</span>
        </div>

        <div className="summary-total">
          <span>Tổng cộng</span>
          <b>8.220.000đ</b>
        </div>

        <button className="btn-primary full" onClick={handleOrder}>
          Đặt hàng
        </button>

        <p className="secure">🔒 Giao dịch được mã hóa SSL an toàn</p>
      </aside>
    </div>
  );
}
