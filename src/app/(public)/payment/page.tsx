"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import axiosClient from "@/libs/axios/axios.client"; // Đảm bảo đường dẫn đúng
import Toast, { ToastType } from "@/components/Toast"; // Đảm bảo đường dẫn đúng
import axios from "axios";

// --- 1. INTERFACES (Định nghĩa kiểu dữ liệu) ---

// Kiểu dữ liệu trả về từ API (Response)
interface OrderItemResponse {
    id: string;
    productId: string;
    productName: string | null; // Backend trả về có thể null hoặc string
    quantity: number;
    currencyPrice: number;
}

interface OrderResponseData {
    id: string;
    status: string;
    totalAmount: number;
    shippingFee: number;
    shippingEmail: string;
    orderItems: OrderItemResponse[];
    createdAt: string;
}

// Kiểu dữ liệu item lưu trong LocalStorage (Rút gọn)
export interface SafeItem {
    productName: string;
    quantity: number;
    currencyPrice: number;
}

// Kiểu dữ liệu đơn hàng lưu trong LocalStorage
export interface SafeOrderData {
    id: string;
    status: string;
    totalAmount: number;
    shippingFee: number;
    shippingEmail: string;
    items: SafeItem[];
    savedAt?: string;
}

// Các kiểu dữ liệu phụ trợ khác
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

export interface Ward {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code?: number;
}

export interface District {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    province_code: number;
    wards: Ward[];
}

export interface Province {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts: District[];
}

// --- 2. COMPONENT CHÍNH ---

export default function CheckoutPage() {
    const router = useRouter();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "qr">("card");
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("success");
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [ward, setWard] = useState<Ward[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        fullName: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        note: "",
        cardNumber: "",
        cardDate: "",
        cardCvc: ""
    });

    // Fetch Provinces
    const fetctProvince = async () => {
        try {
            const resProvince = await axios.get("https://provinces.open-api.vn/api/v1/?depth=3");
            setProvinces(resProvince.data);
        } catch (error) {
            console.error("Error fetching provinces", error);
        }
    };

    // Load Cart & Provinces
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetctProvince().then();
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsed: CartItem[] = JSON.parse(savedCart);
                // Lọc những item được check (nếu có logic check)
                const checkoutItems = parsed.filter(item => item.checked !== false);
                setCart(checkoutItems);
            } catch (error) {
                console.error("Error parsing cart:", error);
            }
        }
        setIsLoading(false);
    }, []);

    // Tính toán tiền
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0) * item.quantity, 0);
    const shippingFee = shippingMethod === "express" ? 50000 : 0;
    const finalTotal = subtotal - totalDiscount + shippingFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- 3. HÀM XỬ LÝ LƯU LOCALSTORAGE (ĐÃ FIX LỖI) ---
    const handleOrderStorage = (orderResponse: OrderResponseData) => {
        // Lấy dữ liệu cũ
        const existingData = localStorage.getItem('guest_order_history');
        let orders: SafeOrderData[] = existingData ? JSON.parse(existingData) : [];

        // Map items từ API sang format lưu trữ (dùng map gọn hơn forEach)
        const items: SafeItem[] = (orderResponse.orderItems || []).map(i => ({
            productName: i.productName || "Sản phẩm", // Fallback nếu null
            quantity: i.quantity,
            currencyPrice: i.currencyPrice
        }));

        // Tạo object an toàn
        const orderSafe: SafeOrderData = {
            id: orderResponse.id,
            items: items,
            shippingEmail: orderResponse.shippingEmail,
            shippingFee: orderResponse.shippingFee,
            status: orderResponse.status,
            totalAmount: orderResponse.totalAmount,
            savedAt: new Date().toISOString() // Lưu thêm ngày giờ lưu
        };

        // Thêm vào đầu mảng (Quan trọng: push biến orderSafe, không push object rỗng)
        orders.unshift(orderSafe);

        // Giới hạn 5 đơn
        if (orders.length > 20) {
            orders = orders.slice(0, 20);
        }

        // Lưu lại
        localStorage.setItem('guest_order_history', JSON.stringify(orders));
    };

    // --- 4. HÀM XỬ LÝ ĐẶT HÀNG ---
    const handleOrder = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^0\d{9}$/;

        // Validate Form
        if (!formData.fullName || !formData.phone || !formData.address) {
            setToastType("error");
            setToastMsg("Vui lòng điền đầy đủ thông tin giao hàng (Họ tên, SĐT, Địa chỉ)!");
            return;
        }
        if (!emailRegex.test(formData.email)) {
            setToastType("error");
            setToastMsg("Email không hợp lệ!");
            return;
        }
        if (!phoneRegex.test(formData.phone)) {
            setToastType("error");
            setToastMsg("Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)!");
            return;
        }
        if (cart.length === 0) {
            setToastType("error");
            setToastMsg("Giỏ hàng trống hoặc chưa chọn sản phẩm nào!");
            return;
        }

        try {
            const formattedAddress = `${formData.city}, ${formData.district}, ${formData.ward}, ${formData.address}${formData.note ? ` {${formData.note}}` : ""}`;

            const orderPayload = {
                clientRequestId: crypto.randomUUID(),
                items: cart.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod: paymentMethod.toUpperCase(),
                shippingFee: shippingFee,
                shippingName: formData.fullName,
                shippingPhone: formData.phone,
                shippingEmail: formData.email,
                shippingAddress: formattedAddress
            };

            // Gọi API
            const res = await axiosClient.post("/orders", orderPayload);

            // LOGIC LƯU TRỮ ĐƯỢC THÊM VÀO ĐÂY
            // Kiểm tra xem data nằm ở đâu trong response (thường là res.data.data hoặc res.data)
            // Dựa trên JSON bạn gửi: { message: "...", data: { ... } }
            // Nếu axiosClient đã intercept trả về body -> dùng res.data
            // Nếu axiosClient trả về full axios response -> dùng res.data.data
            const responseData = res.data?.data;
            console.log(responseData)
            if (responseData && responseData.id) {
                handleOrderStorage(responseData);
            }

            setToastType("success");
            setToastMsg("Place order success!");
            localStorage.removeItem("cart");

            // Redirect về trang chủ hoặc trang chi tiết đơn hàng
            router.push("/order");
        } catch (error) {
            console.error("Order error:", error);
            setToastType("error");
            setToastMsg("Something went wrong");
        }
    };

    if (isLoading) {
        return <div className="checkout-page" style={{ padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="checkout-page">
            <div className="checkout-left">
                {/* 1. customer info */}
                <section className="card">
                    <div className="card-title">
                        <span className="step">1</span>
                        <h3>Thông tin khách hàng</h3>
                        <span className="login">Đã có tài khoản? <b>Đăng nhập</b></span>
                    </div>

                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Email</label>
                            <input
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                className="form-control"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone number</label>
                            <input
                                placeholder="Phone number"
                                name="phone"
                                value={formData.phone}
                                className="form-control"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Full name</label>
                            <input
                                placeholder="Full name"
                                className="form-control"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </section>

                {/* 2. shipping address */}
                <section className="card">
                    <div className="card-title">
                        <span className="step">2</span>
                        <h3>Address shipping</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Address</label>
                            <input
                                className="form-control"
                                placeholder="Home number, street"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Province</label>
                            <select name="city" className="form-select" value={formData.city}
                                    onChange={(e) => {
                                        const selectedCityName = e.target.value;
                                        const selectedProvince = provinces.find(p => p.name === selectedCityName);
                                        const districts = selectedProvince ? selectedProvince.districts : [];
                                        setDistricts(districts);
                                        setWard([]); // Reset ward
                                        handleInputChange(e);
                                    }}>
                                <option value="">Choose province</option>
                                {provinces.map(province => (
                                    <option key={province.code} value={province.name}>{province.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>District</label>
                            <select name="district" value={formData.district} className="form-select"
                                    onChange={(e) => {
                                        const selectedDistrictName = e.target.value;
                                        const selectedDistrict = districts.find(d => d.name === selectedDistrictName);
                                        const wards = selectedDistrict ? selectedDistrict.wards : [];
                                        setWard(wards);
                                        handleInputChange(e);
                                    }}>
                                <option value="">Choose district</option>
                                {districts.map(item => (
                                    <option key={item.code} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Ward</label>
                            <select name="ward" value={formData.ward} className="form-select"
                                    onChange={handleInputChange}>
                                <option value="">Choose ward</option>
                                {ward.map(item => (
                                    <option key={item.code} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Note (optional)</label>
                            <input
                                placeholder="Ghi chú cho người giao hàng"
                                name="note"
                                value={formData.note}
                                className="form-control"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </section>

                {/* 3. shipping method */}
                <section className="card">
                    <div className="card-title">
                        <span className="step">3</span>
                        <h3>Shipping method</h3>
                    </div>
                    <div
                        className={`option ${shippingMethod === "express" ? "active" : ""}`}
                        onClick={() => setShippingMethod("express")}
                    >
                        <div>
                            <b>Shipping standard</b>
                        </div>
                        <span>50.000đ</span>
                    </div>
                </section>

                {/* 4. payment */}
                <section className="card">
                    <div className="card-title">
                        <span className="step">4</span>
                        <h3>Payment method</h3>
                    </div>

                    {/* card */}
                    {/*<div*/}
                    {/*    className={`option column ${paymentMethod === "card" ? "active" : ""}`}*/}
                    {/*    onClick={() => setPaymentMethod("card")}*/}
                    {/*>*/}
                    {/*    /!*<div className="payment-header">*!/*/}
                    {/*    /!*    <div className="payment-title">*!/*/}
                    {/*    /!*        <b>Thẻ tín dụng / Ghi nợ</b>*!/*/}
                    {/*    /!*        <p>Thanh toán an toàn qua Visa, Mastercard</p>*!/*/}
                    {/*    /!*    </div>*!/*/}
                    {/*    /!*    <div className="payment-logos">*!/*/}
                    {/*    /!*        <span className="badge visa">VISA</span>*!/*/}
                    {/*    /!*        <span className="badge mc">MC</span>*!/*/}
                    {/*    /!*    </div>*!/*/}
                    {/*    /!*</div>*!/*/}

                    {/*    {paymentMethod === "card" && (*/}
                    {/*        <>*/}
                    {/*            <input*/}
                    {/*                className="card-input full form-control"*/}
                    {/*                placeholder="Số thẻ"*/}
                    {/*                name="cardNumber"*/}
                    {/*                value={formData.cardNumber}*/}
                    {/*                onChange={handleInputChange}*/}
                    {/*            />*/}
                    {/*            <div className="card-input-row">*/}
                    {/*                <input*/}
                    {/*                    placeholder="MM / YY"*/}
                    {/*                    name="cardDate"*/}
                    {/*                    className="form-control"*/}
                    {/*                    value={formData.cardDate}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                />*/}
                    {/*                <input*/}
                    {/*                    placeholder="Mã CVC"*/}
                    {/*                    name="cardCvc"*/}
                    {/*                    className="form-control"*/}
                    {/*                    value={formData.cardCvc}*/}
                    {/*                    onChange={handleInputChange}*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </>*/}
                    {/*    )}*/}
                    {/*</div>*/}

                    {/* cod */}
                    <div
                        className={` option ${paymentMethod === "cod" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("cod")}
                    >
                        <b>Thanh toán khi nhận hàng (COD)</b>
                    </div>

                    {/* qr */}
                    {/*<div*/}
                    {/*    className={` option ${paymentMethod === "qr" ? "active" : ""}`}*/}
                    {/*    onClick={() => setPaymentMethod("qr")}*/}
                    {/*>*/}
                    {/*    <b>Quét QR</b>*/}
                    {/*    <p>STK: 83868386 – VCB – AN NGUYEN STORE</p>*/}
                    {/*</div>*/}
                </section>
            </div>

            {/* right summary */}
            <aside className="checkout-right card">
                <h3 className="summary-title">Tóm tắt đơn hàng ({cart.length})</h3>

                {cart.length === 0 ? (
                    <p>Chưa có sản phẩm.</p>
                ) : (
                    cart.map((item) => (
                        <div className="summary-product" key={`${item.id}-${item.name}`}>
                            <img
                                src={item.images?.[0]?.imageUrl || "https://via.placeholder.com/80"}
                                alt={item.name}
                            />
                            <div className="info">
                                <b>{item.name}</b>
                                {item.specifications && Object.values(item.specifications).length > 0 && (
                                    <span>{Object.values(item.specifications)[0]}</span>
                                )}
                                <small>SL: {item.quantity}</small>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="price">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                                {item.discount > 0 && (
                                    <div style={{ fontSize: '0.8rem', color: 'green' }}>
                                        -{(item.discount * item.quantity).toLocaleString("vi-VN")}đ
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                <hr />

                <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>

                <div className="summary-row">
                    <span>Giảm giá</span>
                    <span>{totalDiscount.toLocaleString("vi-VN")}đ</span>
                </div>

                <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    {shippingFee === 0 ? (
                        <span className="free">Miễn phí</span>
                    ) : (
                        <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
                    )}
                </div>

                <div className="summary-total">
                    <span>Tổng cộng</span>
                    <b>{finalTotal.toLocaleString("vi-VN")}đ</b>
                </div>

                <button className="btn-primary full" onClick={handleOrder}>
                    Đặt hàng
                </button>
            </aside>
            {toastMsg &&
                <Toast message={toastMsg} position={"top-center"} type={toastType} onClose={() => setToastMsg(null)} />
            }
        </div>
    );
}