"use client";

import {ShoppingCart} from "lucide-react";
import React, {useState} from "react";
import {Product} from "@/app/admin/product/useProducts";
import Toast, {ToastType} from "@/components/Toast";

export default function AddToCartButton({product}: { product: Product }) {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("success");
    
    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
       try{
           e.preventDefault();
           e.stopPropagation();

           // 1. Lấy dữ liệu cũ từ LocalStorage ra
           const cartData = localStorage.getItem("cart");

           // 2. Parse từ JSON string sang Array. Nếu chưa có gì thì tạo mảng rỗng []
           const cartItems: Product[] = cartData ? JSON.parse(cartData) : [];

           // 3. (Tùy chọn) Kiểm tra xem sản phẩm đã có trong giỏ chưa
           //tăng số lượng (quantity)
           const existingIndex = cartItems.findIndex((item) => item.id === product.id);

           if(existingIndex != -1){
               cartItems[existingIndex].quantity += 1;
           }else{
               cartItems.push({...product, quantity: 1});
           }

           // 4. Lưu ngược lại vào LocalStorage (Bắt buộc dùng JSON.stringify)
           localStorage.setItem("cart", JSON.stringify(cartItems));

           // 5. Thông báo người dùng
           setToastType("success");
           setToastMessage("Add to card success");

           // 6. (Nâng cao) Dispatch event để Header tự cập nhật số lượng
           window.dispatchEvent(new Event("storage"));
       }catch (e){
           setToastType("error");
           setToastMessage("Add to cart failed, something went wrong");
           console.log(e);
       }
    }

    return (
        <button
            type="button"
            className="btn btn-outline-success  d-flex align-items-center gap-2"
            onClick={(e) => handleAddToCart}
        >
            <ShoppingCart size={18}/>
            <span>Add to cart</span>
            {toastMessage && <Toast
                message={toastMessage}
                type={toastType}
                duration={1000}

                onClose={() => setToastMessage(null)}
            />}
        </button>
    );
}
