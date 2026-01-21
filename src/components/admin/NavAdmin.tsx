"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import React, {useState} from "react";
import "./NavAdmin.css";
import Toast, {ToastType} from "@/components/Toast";
import axios from "axios";

export interface NavAdminItem {
    label: string;
    href: string;
}

export interface NavAdminProps {
    items: NavAdminItem[];
}

export default function NavAdmin({items}: NavAdminProps) {
    const pathname = usePathname();
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType] = useState<ToastType>("error")

    const logoutHandle = async () => {
        try{
            await axios.post(
                "/api/logout",
                {},
                { withCredentials: true }
            );
        }catch (err){
            setToastMsg("some thing went wrong")
            console.log(err)
        }
    }

    return (
        <nav
            className="fixed-top bg-success shadow-sm navbar navbar-expand-lg px-5 py-0 d-flex justify-content-between align-items-center"
            style={{height: "3.5rem", backgroundColor: "#51af61"}}
        >
            <ul className="navbar-nav h-100">
                {items.map(item => {
                    const active = pathname === item.href;

                    return (
                        <li key={item.href} className="nav-item">
                            <Link
                                href={item.href}
                                className={`nav-link-admin nav-link text-white btn fw-semibold h-100 px-3
                                    ${active ? "active" : ""}`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="dropdown">
                <button className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown"
                        >
                    Option
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <hr className={"m-0"}/>
                    <li><Link className="dropdown-item" onClick={logoutHandle} href="/">Logout</Link></li>
                </ul>
            </div>

            {toastMsg && (
                <Toast
                    message={toastMsg}
                    type={toastType}
                    position="top-center"
                    onClose={() => setToastMsg(null)}
                />
            )}
        </nav>
    );
}
