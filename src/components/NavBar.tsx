"use client"

import Link from "next/link";
import InputCus from "@/components/InputCus";
import {CircleUserIcon, ShoppingBag} from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
}

export interface NavProps {
    items: NavItem[];
    className?: string;
}

export default function NavBar({items, className}: NavProps) {
    return (
        <nav className={`shadow-lg border-bottom navbar navbar-expand-lg ${className}`}>
            <div className={"container d-flex justify-content-between"}>
                <ul className={"navbar-nav"}>
                    <li>
                        <Link href={"/"} className={"nav-link"}>
                            <span className={"fw-bolder"}>AN<span className={"text-success"}>NGUYEN</span></span>
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className={"nav-item"}>
                            <Link className={"nav-link"} href={item.href}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
                <div className={"d-flex gap-3 align-items-center"}>
                    <InputCus placeholder={"Search"} className={"bg-emphasis"}/>
                    <ShoppingBag/>
                    <CircleUserIcon/>
                </div>
            </div>
        </nav>
    );
}