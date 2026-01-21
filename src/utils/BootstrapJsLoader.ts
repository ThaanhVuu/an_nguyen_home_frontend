"use client"

import { useEffect } from "react";

export default function BootstrapJsLoader() {
    useEffect(() => {
        // Sử dụng import() động thay vì require() để tương thích tốt hơn với Next.js
        if (typeof window !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            import("bootstrap/dist/js/bootstrap.bundle.min.js" as unknown);
        }
    }, []);

    return null;
}