/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import "./page.css";

type CartItem = {
  id: number;
  name: string;
  model: string;
  status: "in" | "low" | "out";
  price: number;
  quantity: number;
  checked: boolean;
  image: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      name: "Tủ Lạnh Panasonic Inverter 322L",
      model: "Model: NR-BC360QKVN | Màu: Đen",
      status: "in",
      price: 8590000,
      quantity: 1,
      checked: true,
      image:
        "https://cdn.tgdd.vn/Products/Images/1943/209334/tu-lanh-panasonic-nr-bc360qkvn-2-700x467.jpg",
    },
    {
      id: 2,
      name: "Lò Vi Sóng Sharp 23L 205VN(S)",
      model: "Màu: Bạc | Bảo hành: 1 năm",
      status: "out",
      price: 1890000,
      quantity: 1,
      checked: false,
      image:
        "https://dienmay88hn.com/wp-content/uploads/2023/04/lo-vi-song-sharp-co-nuong-23-lit-r-g372vn-s.jpg",
    },
    {
      id: 3,
      name: "Nồi Chiên Không Dầu Philips XL - HD9270/90",
      model: "Màu: Đen | Dung tích: 6.2L",
      status: "low",
      price: 3200000,
      quantity: 1,
      checked: true,
      image:
        "https://cdn.tgdd.vn/Products/Images/9418/275117/philips-hd9270-90-3-lit-2-1-700x467.jpg",
    },
  ]);

  const isAllChecked =
    cart.filter((i) => i.status !== "out").length > 0 &&
    cart.filter((i) => i.status !== "out").every((i) => i.checked);

  const toggleAll = () => {
    setCart(
      cart.map((i) =>
        i.status === "out" ? i : { ...i, checked: !isAllChecked },
      ),
    );
  };

  const toggleItem = (id: number) => {
    setCart(cart.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const increase = (id: number) => {
    setCart(
      cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  };

  const decrease = (id: number) => {
    setCart(
      cart.map((i) =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const handleCheckout = () => {
    const outProducts = cart.filter(
      (item) => item.checked && item.status === "out",
    );

    if (outProducts.length > 0) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    // nếu không có sản phẩm hết hàng thì tiếp tục thanh toán
    console.log("Thanh toán thành công");
  };

  const subtotal = cart
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-left">
        <h2 className="title">Giỏ hàng của bạn</h2>
        <p className="sub">
          Kiểm tra lại các sản phẩm đã chọn và tiến hành thanh toán
        </p>

        <div className="cart-header">
          <div className="header-product">
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={toggleAll}
            />
            <span>Sản phẩm</span>
          </div>
          <span className="center">Số lượng</span>
          <span className="right">Giá</span>
        </div>

        {cart.map((item) => (
          <div key={item.id} className="cart-row">
            <div className="product">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />

              <img src={item.image} alt={item.name} />

              <div className="info">
                <p className="name">{item.name}</p>

                <p className="model">{item.model}</p>

                <span className={`status ${item.status}`}>
                  {item.status === "in" && "Còn hàng"}
                  {item.status === "low" && "Sắp hết hàng"}
                  {item.status === "out" && "Hết hàng"}
                </span>
              </div>
            </div>

            <div className="quantity">
              <button onClick={() => decrease(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increase(item.id)}>+</button>
            </div>

            <div className="price-wrap">
              <div className="price">
                {(item.price * item.quantity).toLocaleString()} đ
              </div>

              <button
                className="trash"
                onClick={() => removeItem(item.id)}
                title="Xóa sản phẩm"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="cart-right order-summary">
        <h3 className="summary-title">Tóm tắt đơn hàng</h3>

        <div className="summary-row">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString()} đ</span>
        </div>

        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span className="free">Miễn phí</span>
        </div>

        <div className="summary-divider"></div>

        {/* COUPON */}
        <div className="coupon-box">
          <label>MÃ GIẢM GIÁ</label>
          <div className="coupon-input">
            <input placeholder="Nhập mã ưu đãi" />
            <button>Áp dụng</button>
          </div>
        </div>

        <div className="total-box">
          <div>
            <div className="label">Tổng cộng</div>
          </div>

          <div className="price">{subtotal.toLocaleString()} đ</div>
        </div>

        <button className="checkout-btn" onClick={handleCheckout}>
          Tiến hành thanh toán →
        </button>

        <div className="payment-note">🔒 Thanh toán bảo mật tuyệt đối</div>

        <div className="payment-icons">
          <span className="pay-box visa"></span>
          <span className="pay-box master"></span>
          <span className="pay-box momo"></span>
        </div>
      </div>

      {/* SUGGEST PRODUCTS */}
      <div className="suggest">
        <h3 className="suggest-title">Khách hàng hay mua</h3>

        <div className="suggest-list">
          <div className="suggest-item">
            <img
              className="suggest-img"
              src="https://thegioidodung.vn/wp-content/uploads/2024/06/am-sieu-toc-bear-d17h1-1-7-lit.jpg"
              alt="Ấm Đun Siêu Tốc"
            />
            <p className="suggest-name">Ấm Đun Siêu Tốc 1.7L</p>
            <p className="suggest-price">450.000 đ</p>
          </div>

          <div className="suggest-item">
            <img
              className="suggest-img"
              src="https://cdn.mediamart.vn/images/product/may-sy-toc-roler-rhd-1115_aacfb437.jpg"
              alt="Máy Sấy Tóc Pro 2200W"
            />
            <p className="suggest-name">Máy Sấy Tóc Pro 2200W</p>
            <p className="suggest-price">890.000 đ</p>
          </div>

          <div className="suggest-item">
            <img
              className="suggest-img"
              src="https://images.philips.com/is/image/philipsconsumer/vrs_004ba2ab2a47ebb555d1bbb85aa558de1638da99?$pnglarge$&wid=960"
              alt="Bàn Ủi Hơi Nước Easyspeed"
            />
            <p className="suggest-name">Bàn Ủi Hơi Nước Easyspeed</p>
            <p className="suggest-price">650.000 đ</p>
          </div>

          <div className="suggest-item">
            <img
              className="suggest-img"
              src="https://thegioidogiadung.com.vn/40683-large_default/may-xay-sinh-to-toc-do-cao-krups-infinymix-kb9158-1600w.jpg"
              alt="Máy Xay Sinh Tố Tốc Độ Cao"
            />
            <p className="suggest-name">Máy Xay Sinh Tố Tốc Độ Cao</p>
            <p className="suggest-price">1.200.000 đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
