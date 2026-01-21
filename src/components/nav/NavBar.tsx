"use client"

import {NavBrand} from "@/components/nav/NavBrand";
import {NavLink} from "@/components/nav/NavLink";
import {NavActions} from "@/components/nav/NavAction";
import {CSSProperties, useEffect, useState} from "react";

export interface NavItem {
    label?: string;
    href?: string;
}

export interface NavProps {
    items: NavItem[];
    className?: string;
    style?: CSSProperties;
}

export default function NavBar({items, className}: NavProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    return (
        <nav
            className={`fixed-top shadow-sm navbar navbar-expand-lg ${className}`}
            style={{height: "3.5rem", padding: "0.5rem 1rem"}}
        >
            <div className={"d-flex justify-content-between w-100 align-items-center"}>
                <div className={"d-flex justify-content-center"}>
                    <NavBrand/>
                    <NavLink items={items}/>
                </div>
                <NavActions/>
            </div>
        </nav>
    );
}