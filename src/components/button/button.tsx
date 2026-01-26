"use client";

import {ShoppingCart} from "lucide-react";
import React, {useState} from "react";
import {Product} from "@/app/admin/product/useProducts";
import Toast, {ToastType} from "@/components/Toast";

export default function AddToCartButton({product}: { product: Product }) {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("success");
    
    const handleAddToCart = () => {
        try{
           const cartData = localStorage.getItem("cart");

           const cartItems: Product[] = cartData ? JSON.parse(cartData) : [];

           const existingIndex = cartItems.findIndex((item) => item.id === product.id);

           if(existingIndex != -1){
               cartItems[existingIndex].quantity += 1;
           }else{
               cartItems.push({...product, quantity: 1});
           }

           localStorage.setItem("cart", JSON.stringify(cartItems));

           setToastType("success");
           setToastMessage("Add to card success");

           // window.dispatchEvent(new Event("storage"));
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
            onClick={handleAddToCart}
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
