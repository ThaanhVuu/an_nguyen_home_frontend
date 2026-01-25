"use client";

import { useEffect, useState } from "react";
import AddToCartButton from "@/components/button/button";
import { Product } from "@/app/admin/product/useProducts";
import axiosClient from "@/libs/axios/axios.client"; // Đảm bảo axiosClient đã config baseURL hoặc dùng đường dẫn đúng
import { useParams } from "next/navigation";

const initProduct: Product = {
    id: "",
    categoryId: "",
    categoryName: "",
    name: "Đang tải...",
    slug: "",
    description: "",
    specifications: {},
    price: 0,
    discount: 0,
    quantity: 0,
    isActive: false,
    images: [],
};

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id;
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<Product>(initProduct);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        try {
            const res = await axiosClient.get(`/products/${id}`);
            setProduct(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Gọi hàm fetch trong useEffect khi có id
    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const finalPrice = (product.price ?? 0) - (product.discount ?? 0);

    if (loading) return <div className="container mt-5 text-center">Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="row g-4">
                {/* Hình ảnh sản phẩm */}
                <div className="col-md-6">
                    <img
                        src={product.images?.[selectedImage]?.imageUrl ?? "https://via.placeholder.com/300"}
                        alt={product.images?.[selectedImage]?.altText ?? "Product Image"}
                        className="img-fluid border rounded"
                        style={{ width: "100%", height: "400px", objectFit: "contain" }}
                    />

                    <div className="d-flex gap-2 mt-3 overflow-auto">
                        {product.images?.map((img, index) => (
                            <img
                                key={index}
                                src={img.imageUrl}
                                alt={img.altText}
                                onClick={() => setSelectedImage(index)}
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border:
                                        selectedImage === index
                                            ? "2px solid #0d6efd"
                                            : "1px solid #ccc",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Thông tin sản phẩm */}
                <div className="col-md-6">
                    <h3 className="fw-bold">{product.name}</h3>
                    <p className="text-muted">
                        Danh mục: <strong>{product.categoryName}</strong>
                    </p>

                    <h4 className="text-danger fw-bold">
                        {finalPrice.toLocaleString("vi-VN")} ₫
                        {(product.discount ?? 0) > 0 && (
                            <span className="text-muted fs-6 text-decoration-line-through ms-2">
                                {product.price.toLocaleString("vi-VN")} ₫
                            </span>
                        )}
                    </h4>

                    <p>
                        Trạng thái:{" "}
                        <span className={`fw-semibold ${product.isActive ? "text-success" : "text-danger"}`}>
                            {product.isActive ? "Còn hàng" : "Hết hàng"}
                        </span>
                    </p>

                    <p>Số lượng còn lại: {product.quantity}</p>

                    <div className="d-flex gap-3 mt-3">
                        <AddToCartButton product={product} />
                        <button className="btn btn-outline-secondary">Mua ngay</button>
                    </div>
                </div>
            </div>

            {/* Thông số kỹ thuật */}
            <div className="mt-5">
                <h5 className="fw-bold mb-3">Thông số kỹ thuật</h5>
                <table className="table table-bordered">
                    <tbody>
                    {Object.entries(product.specifications || {}).length > 0 ? (
                        Object.entries(product.specifications || {}).map(([key, value]) => (
                            <tr key={key}>
                                <th className="bg-light" style={{ width: "30%" }}>{key}</th>
                                <td>{String(value)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={2}>Chưa có thông số kỹ thuật</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Mô tả sản phẩm */}
            <div className="mt-5 mb-5">
                <h5 className="fw-bold mb-3">Mô tả sản phẩm</h5>
                <div
                    className="border rounded p-3 bg-white"
                    dangerouslySetInnerHTML={{ __html: product.description || "" }}
                />
            </div>
        </div>
    );
}