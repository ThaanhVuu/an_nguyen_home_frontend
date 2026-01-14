"use client";

import { ShoppingCart } from "lucide-react";

export default function AddToCartButton() {
  return (
    <button
      type="button"
      className="btn btn-outline-success  d-flex align-items-center gap-2"
    >
      <ShoppingCart size={18} />
      <span>Add to cart</span>
    </button>
  );
}
