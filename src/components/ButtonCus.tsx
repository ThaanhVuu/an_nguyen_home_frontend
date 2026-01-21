"use client";

import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "btn-primary" | "btn-outline" | "btn-dark";
    customClass?: string;
};

export default function Button({
                                   children,
                                   type = "button",
                                   variant = "btn-primary",
                                   loading = false,
                                   disabled = false,
                                   onClick,
                                   customClass,
                               }: ButtonProps) {
    return (
        <button
            type={type}
            className={`btn ${variant} ${customClass}`}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading
                ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                : children}
        </button>
    );
}
