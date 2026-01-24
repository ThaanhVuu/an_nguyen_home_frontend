"use client"
import { Column, TableCus } from "@/components/TableCus";
import useProducts, { Product } from "@/app/admin/product/useProducts";
import React, { useState } from "react";
import { Pagination } from "@/components/Pagination";
import ModalClient from "@/components/modal/ModalClient";
import { useModal } from "@/hooks/useModalClient";
import useCategories from "@/app/admin/category/useCategories";
import Toast, { ToastType } from "@/components/Toast";

import ProductFilter from "./components/ProductFilter"
import ProductForm from "./components/ProductForm";
import ProductDetail from "./components/ProductDetail";

const INIT_PRODUCT: Product = {
    id: "",
    name: "",
    price: 0,
    slug: "",
    isActive: true,
    discount: 0,
    categoryName: "",
    images: [],
    quantity: 0,
    categoryId: "",
    description: "",
    specifications: {}
}

export default function ProductComponent() {
    const ID_MODAL = "productModal";
    const ID_MODAL_DETAIL = "productDetailModal";

    // --- STATE ---
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("success");
    const [tempSearch, setTempSearch] = useState<string>("")

    const [filterInputs, setFilterInputs] = useState({
        category: "",
        priceFrom: "" as number | "",
        priceTo: "" as number | "",
        status: ""
    });

    // State SpecsList (Cần giữ ở cha để truyền vào Form và xử lý Save)
    const [specsList, setSpecsList] = useState<{ key: string, value: string }[]>([]);
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);

    // --- HOOKS ---
    const { categories: subCategories } = useCategories(1000, "hasParent");
    const {
        products,
        pagination,
        setPriceMax,
        setPriceMin,
        setFilterCategory,
        setFilterStatus,
        setKeyword,
        setPage,
        setSize,
        deleteProduct,
        insertProduct,
        updateProduct,
    } = useProducts();

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<Product>(INIT_PRODUCT);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { open, close } = useModal(ID_MODAL);
    const { open: openDetail, close: closeDetail } = useModal(ID_MODAL_DETAIL);

    // --- TABLE CONFIG ---
    const columns: Column<Product>[] = [
        {
            header: "Name",
            className: "fw-bold text-primary",
            accessor: "name",
            render: (product) => (
                <div className="d-flex flex-column">
                    <span>{product.name}</span>
                    <small className="text-muted fst-italic fw-normal">{product.slug}</small>
                </div>
            )
        },
        { header: "Category", className: "text-right", accessor: "categoryName" },
        {
            header: "Price",
            className: "text-right",
            render: (product) => (
                <div>
                    <div className={"line-through text-xs text-success"}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>
                    {product.discount ? product.discount > 0 && (
                        <div className="text-danger font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price - product.discount)}
                        </div>
                    ) : 0}
                </div>
            )
        },
        {
            header: "Status",
            className: "text-center",
            render: (product) => (
                <span className={`badge ${product.isActive ? "bg-success" : "bg-danger"}`}>
                    {product.isActive ? "Active" : "Hidden"}
                </span>
            )
        }
    ];

    // --- HANDLERS ---
    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) setSelectedIds(products.map((c) => c.id));
        else setSelectedIds([]);
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds((prev) => prev.filter((x) => x !== id));
        else setSelectedIds((prev) => [...prev, id]);
    };

    const handleEnterKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setKeyword(tempSearch);
            setPage(0);
        }
    };

    // --- ACTION HANDLERS ---
    const handleApplyFilter = () => {
        setFilterCategory(filterInputs.category);
        setFilterStatus(filterInputs.status);
        setPriceMin(filterInputs.priceFrom);
        setPriceMax(filterInputs.priceTo);
        setPage(0);
    };

    const handleResetFilter = () => {
        setFilterInputs({ category: "", priceFrom: "", priceTo: "", status: "" });
        setFilterCategory("");
        setFilterStatus("");
        setPriceMin("");
        setPriceMax("");
        setPage(0);
    };

    const handleAddNew = () => {
        setIsEditMode(false);
        setFormData(INIT_PRODUCT);
        setSpecsList([]);
        open();
    }

    const handleUpdate = () => {
        if (selectedIds.length !== 1) {
            setToastType("error");
            setToastMsg("Please select exactly one product to update.");
            return;
        }
        const productToEdit = products.find(p => p.id === selectedIds[0]);
        if (productToEdit) {
            setIsEditMode(true);
            setFormData(productToEdit);
            if (productToEdit.specifications) {
                const list = Object.entries(productToEdit.specifications).map(([k, v]) => ({
                    key: k,
                    value: v !== null && v !== undefined ? String(v) : ""
                }));
                setSpecsList(list);
            } else {
                setSpecsList([]);
            }
            open();
        }
    }

    const handleShowDetail = () => {
        if (selectedIds.length !== 1) {
            setToastType("error");
            setToastMsg("Please select exactly one product to view details.");
            return;
        }
        const product = products.find(p => p.id === selectedIds[0]);
        if (product) {
            setDetailProduct(product);
            openDetail();
        }
    }

    const handleSave = async () => {
        try {
            const specsObject = specsList.reduce((acc, item) => {
                if (item.key && item.key.trim() !== "") acc[item.key] = item.value;
                return acc;
            }, {} as Record<string, any>);

            const payload = { ...formData, specifications: specsObject };

            if (isEditMode) await updateProduct(payload);
            else await insertProduct(payload);

            setToastType("success");
            setToastMsg(`${isEditMode ? "Update" : "Insert"} product success`);
            close();
        } catch (e: any) {
            const message: string = e.response?.data?.message || "Something went wrong";
            setToastType("error");
            setToastMsg(message);
        }
    }

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm("Are you sure you want to delete these products?")) return;
        try {
            await deleteProduct(selectedIds);
            setToastType("success");
            setToastMsg("Delete products success");
            setSelectedIds([]);
        } catch (e: any) {
            const message: string = e.response?.data?.message || "Something went wrong";
            setToastType("error");
            setToastMsg(message);
        }
    }

    // --- RENDER ---
    return (
        <section className={"row container-fluid mt-5"}>
            {/* SIDEBAR (Action Buttons + Search + Filter) */}
            <aside className={"col-2 d-flex flex-column justify-content-start gap-2"}>
                <h4 className={`fw-bold mt-3 mb-1`}>Product</h4>

                <div className={"d-flex gap-2"}>
                    <button className={`btn btn-success w-50`} onClick={handleAddNew}>Add +</button>
                    <button className={`btn btn-info w-50 text-white`} disabled={selectedIds.length !== 1} onClick={handleShowDetail}>Detail</button>
                </div>
                <div className={"d-flex gap-2"}>
                    <button className={`btn btn-primary w-50`} disabled={selectedIds.length !== 1} onClick={handleUpdate}>Update</button>
                    <button className={`btn btn-danger w-50`} disabled={selectedIds.length < 1} onClick={handleDelete}>Delete</button>
                </div>

                {/* Component ProductFilter */}
                <ProductFilter
                    tempSearch={tempSearch}
                    setTempSearch={setTempSearch}
                    handleEnterKeydown={handleEnterKeydown}
                    filterInputs={filterInputs}
                    setFilterInputs={setFilterInputs}
                    onApply={handleApplyFilter}
                    onReset={handleResetFilter}
                    subCategories={subCategories}
                />
            </aside>

            {/* MAIN CONTENT (Table + Pagination) */}
            <div className={"col-10 mt-3"}>
                <TableCus
                    data={products}
                    columns={columns}
                    maxHeight={"500px"}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                />
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.size}
                    totalElements={pagination.totalElements}
                    onPageChange={setPage}
                    onSizeChange={(size) => { setSize(size); setPage(0); }}
                />

                {/* MODAL CREATE/UPDATE */}
                <ModalClient
                    id={ID_MODAL}
                    title={isEditMode ? "Update Product" : "Insert new product"}
                    footer={(
                        <div>
                            <button type="button" className="btn btn-secondary me-2" onClick={close}>Cancel</button>
                            <button type="button" className="btn btn-success" onClick={handleSave}>{isEditMode ? "Update" : "Save"}</button>
                        </div>
                    )}
                >
                    <ProductForm
                        formData={formData}
                        setFormData={setFormData}
                        isEditMode={isEditMode}
                        subCategories={subCategories}
                        specsList={specsList}
                        setSpecsList={setSpecsList}
                    />
                </ModalClient>

                {/* MODAL DETAIL */}
                {detailProduct && (
                    <ModalClient
                        id={ID_MODAL_DETAIL}
                        title={`Detail: ${detailProduct.name}`}
                        footer={<button type="button" className="btn btn-secondary" onClick={closeDetail}>Close</button>}
                    >
                        <ProductDetail product={detailProduct} />
                    </ModalClient>
                )}
            </div>
            {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />}
        </section>
    )
}