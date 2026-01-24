"use client";

import CategoryCard from "@/components/categorycard/CategoryCard";
import {FaSnowflake, FaTshirt} from "react-icons/fa";
import {MdAcUnit} from "react-icons/md";
import useCategories from "@/app/admin/category/useCategories";

export default function CategoryPage() {
    const {rootCategories} = useCategories();
    // const categories = [
    //     {
    //         id: 1,
    //         title: "Tủ lạnh",
    //         icon: <FaSnowflake/>,
    //         href: "/product?category=tu-lanh",
    //     },
    //     {
    //         id: 2,
    //         title: "Máy giặt",
    //         icon: <FaTshirt/>,
    //         href: "/product?category=may-giat",
    //     },
    //     {
    //         id: 3,
    //         title: "Điều hòa",
    //         icon: <MdAcUnit/>,
    //         href: "/product?category=dieu-hoa",
    //     },
    // ];

    return (
        <div className="container mt-4">
            <h4 className="fw-bold mb-4" style={{marginTop: "5rem"}}>Danh mục sản phẩm</h4>

            <div className="row g-4">
                {rootCategories.map((cat) => (
                    <div key={cat.id} className="col-12 col-sm-6 col-lg-4">
                        <CategoryCard id={cat.id} title={cat.name} icon={<FaSnowflake/>} href={"#"}/>
                    </div>
                ))}
            </div>
        </div>
    );
}
