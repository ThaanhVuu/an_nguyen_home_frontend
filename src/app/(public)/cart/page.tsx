/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import "./page.css";
import {useRouter} from "next/navigation";

type CartItem = {
    id: string;
    name: string;
    slug: string;
    specifications: Record<string, string | number>;
    price: number;
    discount: number;
    quantity: number;
    isActive: boolean;
    images: { imageUrl: string; altText?: string }[];
    checked?: boolean;
};

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart && savedCart !== "undefined") {
            try {
                const parsed: CartItem[] = JSON.parse(savedCart);
                const updatedCart = parsed.map(item => ({
                    ...item,
                    checked: item.checked ?? true
                }));
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCart(updatedCart);
            } catch (error) {
                console.error("Lỗi parse giỏ hàng:", error);
            }
        }
        setIsLoading(false);
    }, []);

    const updateCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // Logic xử lý (giữ nguyên các hàm toggle, increase, decrease, remove của bạn)
    const isAllChecked = cart.length > 0 && cart.every((i) => i.checked);
    const toggleAll = () => updateCart(cart.map((i) => ({ ...i, checked: !isAllChecked })));
    const toggleItem = (id: string) => updateCart(cart.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
    const increase = (id: string) => updateCart(cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
    const decrease = (id: string) => updateCart(cart.map((i) => (i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i)));
    const removeItem = (id: string) => updateCart(cart.filter((i) => i.id !== id));

    const subtotal = cart
        .filter((i) => i.checked)
        .reduce((sum, i) => sum + i.price * i.quantity, 0);

    const subDiscount = cart.filter(i => i.checked)
        .reduce((sum, i) => sum + (i.discount) * i.quantity, 0);

    const handlePayment = () => {
        router.push("/payment");
    };

    if (isLoading) return <div className="cart-page">Đang tải giỏ hàng...</div>;

    return (
        <div className="cart-page">
            <div className="cart-left">
                <h2 className="title">Giỏ hàng của bạn ({cart.length})</h2>

                {cart.length === 0 ? (
                    <p style={{ marginTop: '20px' }}>Giỏ hàng đang trống.</p>
                ) : (
                    <>
                        <div className="cart-header">
                            <div className="header-product">
                                <input type="checkbox" className={"form-check-input"} checked={isAllChecked} onChange={toggleAll} />
                                <span>Sản phẩm</span>
                            </div>
                            <span className="center">Số lượng</span>
                            <span className="right">Giá cộng dồn</span>
                        </div>

                        {cart.map((item) => (
                            <div key={item.id} className="cart-row">
                                <div className="product">
                                    <input
                                        type="checkbox"
                                        className={"form-check-input"}
                                        checked={item.checked}
                                        onChange={() => toggleItem(item.id)}
                                    />
                                    <img
                                        src={item.images?.[0]?.imageUrl || "https://via.placeholder.com/150"}
                                        alt={item.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                    />
                                    <div className="info">
                                        <p className="name">{item.name}</p>

                                        {/* HIỂN THỊ THÔNG SỐ ĐỘNG TẠI ĐÂY */}
                                        <p className="model" style={{ fontSize: '13px', color: '#666' }}>
                                            {item.specifications && Object.keys(item.specifications).length > 0
                                                ? Object.entries(item.specifications)
                                                    .map(([key, value]) => `${value}`) // Chỉ lấy giá trị, hoặc `${key}: ${value}` nếu muốn hiện cả tên
                                                    .join(" | ")
                                                : "Mô tả đang cập nhật"}
                                        </p>

                                        <span className={`status ${item.isActive ? 'in' : 'out'}`}>
                                            {item.isActive ? "Còn hàng" : "Hết hàng"}
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
                                        {((item.price - item.discount) * item.quantity).toLocaleString("vi-VN")} đ
                                    </div>
                                    <button className="trash" onClick={() => removeItem(item.id)}>🗑</button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* PHẦN TỔNG THANH TOÁN (Giữ nguyên) */}
            <div className="cart-right order-summary">
                <h3 className="summary-title">Tóm tắt đơn hàng</h3>
                <div className="summary-row">
                    <span>Tổng giá</span>
                    <span>{subtotal.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="summary-row">
                    <span>Giảm giá</span>
                    <span>{subDiscount.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="total-box">
                    <div className="label">Tổng thanh toán</div>
                    <div className="price" style={{ color: '#d70018', fontSize: '20px', fontWeight: 'bold' }}>
                        {(subtotal - subDiscount).toLocaleString("vi-VN")} đ
                    </div>
                </div>
                <button className="checkout-btn" disabled={cart.length === 0} onClick={handlePayment}>
                    Tiến hành thanh toán →
                </button>
            </div>
        </div>
    );
}
