"use client"
import {useEffect} from "react";

export default function BootstrapJsLoader(){
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("bootstrap/dist/js/bootstrap.bundle.min.js" as never);
        }
    }, []);

    return null;
}