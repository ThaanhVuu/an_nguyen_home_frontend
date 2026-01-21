import React, {ReactNode} from "react";
import NavAdmin, {NavAdminItem} from "@/components/admin/NavAdmin";

export default function Layout({
                                   children,
                               }: {
    children: ReactNode;
}) {
    const itemNavs: NavAdminItem[] = [
        { label: "Dashboard", href: "/admin"},
        { label: "Category", href: "/admin/category"},
        { label: "Product", href: "/admin/product"},
        { label: "Order", href: "/admin/order"},
    ];

    return (
        <>
            <header>
                <NavAdmin items={itemNavs}/>
            </header>
            <main>
                {children}
            </main>
        </>
    );

}
