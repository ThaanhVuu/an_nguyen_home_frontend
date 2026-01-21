"use client";

import { useEffect } from "react";
import "./Toast.css"

type ToastPosition = "top-left" | "top-center" | "top-right";
export type ToastType = "success" | "error" | "info";

type ToastProps = {
    message: string;
    duration?: number;
    type?: ToastType;
    position?: ToastPosition;
    onClose: () => void;
};

export default function Toast({
                                  message,
                                  duration = 3000,
                                  type = "info",
                                  position = "top-right",
                                  onClose,
                              }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`simple-toast ${type} ${position}`}>
            {message}
        </div>
    );
}
