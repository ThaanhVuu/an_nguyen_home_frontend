"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import "./page.css";
import axiosClient from "@/libs/axios/axios.client";
import Toast, {ToastType} from "@/components/Toast";
import axios from "axios";

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
    district_code?: number; // Thường dùng để map ngược lại district
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

export default function CheckoutPage() {
    const router = useRouter();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "qr">("card");
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("success");
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [ward, setWard] = useState<Ward[]>([])
    // Form state
    // Using simple state for form fields matching the UI
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

    const [isLoading, setIsLoading] = useState(true);

    const fetctProvince = async () => {
        const resProvince = await axios.get("https://provinces.open-api.vn/api/v1/?depth=3");
        setProvinces(resProvince.data);
    }

    useEffect(() => {
        fetctProvince().then();
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsed: CartItem[] = JSON.parse(savedCart);
                // We filter for checked items if the logic exists, otherwise all items
                // Based on cart/page.tsx logic, items have a 'checked' property.
                // If 'checked' is undefined, we assume true or handle it.
                // cart/page.tsx defaults checked to true if undefined.
                const checkoutItems = parsed.filter(item => item.checked !== false);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCart(checkoutItems);
            } catch (error) {
                console.error("Error parsing cart:", error);
            }
        }
        setIsLoading(false);
    }, []);

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0) * item.quantity, 0);
    const shippingFee = shippingMethod === "express" ? 50000 : 0;
    const finalTotal = subtotal - totalDiscount + shippingFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        // For specific fields that might not have a name attribute in the original HTML,
        // we need to add name attributes to the inputs in the JSX below.
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleOrder = async () => {
        // Basic validation
        if (!formData.fullName || !formData.phone || !formData.address) {
            setToastType("error");
            setToastMsg("Vui lòng điền đầy đủ thông tin giao hàng (Họ tên, SĐT, Địa chỉ)!");
            return;
        }

        if (cart.length === 0) {
            setToastType("error");
            setToastMsg("Giỏ hàng trống hoặc chưa chọn sản phẩm nào!");
            return;
        }

        try {
            // Map logic to match CreateOrderRequest DTO
            // Address format: "tỉnh, Xã, Số nhà tên đường {ghi chú}"
            const formattedAddress = `${formData.city}, ${formData.ward}, ${formData.address}${formData.note ? ` {${formData.note}}` : ""}`;

            const orderPayload = {
                clientRequestId: crypto.randomUUID(), // Generates a unique ID
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                paymentMethod: paymentMethod.toUpperCase(), // Enum usually uppercase in Java
                shippingFee: shippingFee,
                shippingName: formData.fullName,
                shippingPhone: formData.phone,
                shippingEmail: formData.email,
                shippingAddress: formattedAddress
            };

            console.log("Payload to send:", orderPayload);

            const res = await axiosClient.post("/orders", orderPayload);
            setToastType("success");
            setToastMsg(res.data.message);
            router.push("/");
        } catch (error) {
            console.error("Order error:", error);
            setToastType("error")
            setToastMsg("Something went wrong");
        }
    };

    if (isLoading) {
        return <div className="checkout-page" style={{padding: '2rem'}}>Loading...</div>;
    }

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
                            <input
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                className="form-control"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                placeholder="Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                className="form-control"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                placeholder="Họ và tên"
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
                        <h3>Địa chỉ giao hàng</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Địa chỉ đường</label>
                            <input
                                className="form-control"
                                placeholder="Số nhà, tên đường"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tỉnh / Thành phố</label>
                            <select name="city" className="form-select" value={formData.city}
                                    onChange={(e) => {
                                        const selectedCityName = e.target.value;
                                        const selectedProvince = provinces.find(p => p.name === selectedCityName);
                                        const districts = selectedProvince ? selectedProvince.districts : [];
                                        setDistricts(districts)
                                        handleInputChange(e)
                                    }}>
                                <option value="">Chọn tỉnh / thành phố</option>
                                {provinces.map(province => (
                                    <option key={province.code} data-pro={province.districts} value={province.name}>{province.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quận / Huyện</label>
                            <select name="district" value={formData.district} className="form-select"
                                    onChange={(e) => {
                                      const selectedDistrictName = e.target.value;
                                      const selectedDistrict = districts.find(d => d.name === selectedDistrictName);
                                      const wards = selectedDistrict ? selectedDistrict.wards : [];
                                      setWard(wards)
                                      handleInputChange(e);
                                    }}>
                                <option value="">Chọn quận / huyện</option>
                                {districts.map(item => (
                                    <option key={item.code} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Phường / Xã</label>
                            <select name="ward" value={formData.ward} className="form-select"
                                    onChange={handleInputChange}>
                                <option value="">Chọn phường / xã</option>
                                {ward.map(item => (
                                    <option key={item.code} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Ghi chú (tuỳ chọn)</label>
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
                        <h3>Phương thức giao hàng</h3>
                    </div>
                    {/*
          <div
            className={`option ${shippingMethod === "standard" ? "active" : ""
              }`}
            onClick={() => setShippingMethod("standard")}
          >
            <div>
              <b>Giao hàng tiêu chuẩn</b>
              <p>3–5 ngày làm việc</p>
            </div>
            <span className="free">Miễn phí</span>
          </div> */}

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
                        className={`option column ${paymentMethod === "card" ? "active" : ""
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
                                <input
                                    className="card-input full form-control"
                                    placeholder="Số thẻ"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                />

                                <div className="card-input-row">
                                    <input
                                        placeholder="MM / YY"
                                        name="cardDate"
                                        className="form-control"
                                        value={formData.cardDate}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        placeholder="Mã CVC"
                                        name="cardCvc"
                                        className="form-control"
                                        value={formData.cardCvc}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* cod */}
                    <div
                        className={` option ${paymentMethod === "cod" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("cod")}
                    >
                        <b>Thanh toán khi nhận hàng (COD)</b>
                    </div>

                    {/* qr */}
                    <div
                        className={` option ${paymentMethod === "qr" ? "active" : ""}`}
                        onClick={() => setPaymentMethod("qr")}
                    >
                        <b>Quét QR</b>
                        <p>STK: 83868386 – VCB – AN NGUYEN STORE</p>
                    </div>
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
                            <div style={{textAlign: 'right'}}>
                                <span className="price">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                                {item.discount > 0 && (
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'green'
                                    }}>-{(item.discount * item.quantity).toLocaleString("vi-VN")}đ</div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                <hr/>

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
                <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)}/>
            }
        </div>
    );
}
