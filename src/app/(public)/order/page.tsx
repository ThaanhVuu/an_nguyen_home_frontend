"use client";

import { useState, useEffect } from "react";
import "./page.css";
import {SafeOrderData} from "@/app/(public)/payment/page";

// Interface for items saved in LocalStorage
export default function OrderPage() {
    const [orders, setOrders] = useState<SafeOrderData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedOrders = localStorage.getItem("guest_order_history");
        if (savedOrders) {
            try {
                const parsedOrders: SafeOrderData[] = JSON.parse(savedOrders);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setOrders(parsedOrders);
            } catch (error) {
                console.error("Error parsing order history:", error);
            }
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="order-page">Loading...</div>;
    }

    return (
        <div className="order-page">
            <h1 className="title mt-5">Lịch sử đơn hàng</h1>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa có đơn hàng nào.</p>
                </div>
            ) : (
                <div className="order-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Đơn hàng #{order.id.slice(0, 8).toUpperCase()}</span>
                                <span className={`order-status ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span>{item.productName} (x{item.quantity})</span>
                                        <span>{(item.currencyPrice * item.quantity).toLocaleString("vi-VN")}đ</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <span>
                                    {order.savedAt ? new Date(order.savedAt).toLocaleDateString("vi-VN", {
                                        hour: '2-digit', minute: '2-digit'
                                    }) : ''}
                                </span>
                                <div className="order-total">
                                    Tổng cộng: {order.totalAmount.toLocaleString("vi-VN")}đ
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
