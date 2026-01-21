"use client";

import { useEffect, useState } from "react";

export function useModal(id: string) {
    // Lưu instance của Modal vào state để tái sử dụng
    const [modalInstance, setModalInstance] = useState<any>(null);

    useEffect(() => {
        // Chỉ chạy trên trình duyệt (Client-side)
        const loadBootstrap = async () => {
            try {
                // 1. Dynamic Import: Load thư viện Bootstrap JS
                const { Modal } = await import("bootstrap");

                const element = document.getElementById(id);

                if (element) {
                    // 2. Kiểm tra xem modal đã có instance chưa, nếu chưa thì tạo mới
                    // Điều này tránh lỗi tạo đè nhiều instance lên 1 DOM
                    const instance = Modal.getInstance(element) || new Modal(element);
                    setModalInstance(instance);
                }
            } catch (error) {
                console.error("Không thể load Bootstrap modal:", error);
            }
        };

        loadBootstrap();
    }, [id]); // Chạy lại nếu ID thay đổi

    return {
        open: () => {
            if (modalInstance) modalInstance.show();
            else console.warn(`Modal với id "${id}" chưa sẵn sàng hoặc không tìm thấy.`);
        },

        close: () => {
            if (modalInstance) modalInstance.hide();
        },

        // Trả về instance gốc nếu cần can thiệp sâu hơn
        instance: modalInstance
    };
}