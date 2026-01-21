"use client";

import { useState } from "react";
import "./CategoryCard.css";

type CategoryCardProps = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

export default function CategoryCard({ title, icon, href }: CategoryCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="category-card-wrapper">
      <div className="category-card" onClick={() => setOpen((prev) => !prev)}>
        <div className="icon">{icon}</div>
        <div className="title">{title}</div>
      </div>
      <div className={`category-dropdown ${open ? "open" : ""}`}>
        <a href={`${href}&type=mini`}>Loại mini</a>
        <a href={`${href}&type=inverter`}>Inverter</a>
        <a href={`${href}&type=cao-cap`}>Cao cấp</a>
      </div>
    </div>
  );
}
