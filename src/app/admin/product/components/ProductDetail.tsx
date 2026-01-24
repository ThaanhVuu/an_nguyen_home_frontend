import React from "react";
import { Product } from "@/app/admin/product/useProducts";

export default function ProductDetail({ product }: { product: Product }) {
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Cột Trái: Ảnh */}
                <div className="col-md-5 mb-3">
                    <div className="border rounded p-2 bg-light text-center">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].imageUrl} alt={product.name} className="img-fluid rounded shadow-sm" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                        ) : (
                            <div className="py-5 text-muted">No Image Available</div>
                        )}
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="d-flex gap-2 mt-2 overflow-auto">
                            {product.images.map((img, idx) => (
                                <img key={idx} src={img.imageUrl} alt="" className="border rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Cột Phải: Thông tin */}
                <div className="col-md-7">
                    <h2 className="fw-bold text-primary">{product.name}</h2>
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <span className={`badge fs-6 ${product.isActive ? "bg-success" : "bg-danger"}`}>
                            {product.isActive ? "Active" : "Hidden"}
                        </span>
                        <span className="badge bg-secondary fs-6">{product.categoryName || "Uncategorized"}</span>
                    </div>

                    <h3 className="text-danger fw-bold mb-3">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        {product.discount ? <small className="text-muted text-decoration-line-through ms-2 fs-6">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price + product.discount)}</small> : ""}
                    </h3>

                    <p><strong>Quantity:</strong> {product.quantity} units</p>
                    <div className="card bg-light mb-3">
                        <div className="card-body">
                            <h6 className="card-title fw-bold">Description</h6>
                            <p className="card-text" style={{ whiteSpace: 'pre-line' }}>{product.description || "No description."}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications Table */}
            <div className="row mt-3">
                <div className="col-12">
                    <h5 className="border-bottom pb-2 fw-bold">Specifications</h5>
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                        <table className="table table-striped table-bordered mt-2">
                            <tbody>
                            {Object.entries(product.specifications).map(([key, value], idx) => (
                                <tr key={idx}>
                                    <td className="fw-bold" style={{ width: '30%' }}>{key}</td>
                                    <td>{String(value)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted fst-italic">No specifications available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}