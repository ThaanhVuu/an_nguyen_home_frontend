"use client";

import "./CategoryCard.css";
import {Category} from "@/app/admin/category/useCategories";
import Link from "next/link";
import axiosClient from "@/libs/axios/axios.client";
import React, {ReactNode, useState} from "react";

type CategoryCardProps = {
    id: string;
    title: string;
    icon: ReactNode;
    href: string;
};

export default function CategoryCard({id, title, icon}: CategoryCardProps) {
    const [open, setOpen] = useState(false);
    const [subCategories, setSubCategories] = useState<Category[]>([]);

    const fetct = async () => {
        try {
            if(!open){
                const res = await axiosClient.get(`/categories/sub`, {params: {filter: id}});
                setSubCategories(res.data.data.data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleClick = async () => {
        setOpen((prev) => !prev);
        fetct().then();
    }

    return (
        <div className="category-card-wrapper">
            <div className="category-card" onClick={handleClick}>
                <div className="icon">{icon}</div>
                <div className="title">{title}</div>
            </div>
            <div className={`category-dropdown ${open ? "open" : ""}`}>
                {subCategories.map(item => (
                    <Link key={item.id} href={`http://localhost:3000/products?filter=${item.id}`}>{item.name}</Link>
                ))}
            </div>
        </div>
    );
}
