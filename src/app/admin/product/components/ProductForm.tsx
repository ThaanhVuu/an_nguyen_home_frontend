import React from "react";
import { Product } from "@/app/admin/product/useProducts";
import { Category } from "@/app/admin/category/useCategories";
import { convertToSlug } from "@/utils/toSlug";

interface ProductFormProps {
    formData: Product;
    setFormData: React.Dispatch<React.SetStateAction<Product>>;
    isEditMode: boolean;
    subCategories: Category[];
    specsList: { key: string; value: string }[];
    setSpecsList: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>;
}

export default function ProductForm({
                                        formData,
                                        setFormData,
                                        isEditMode,
                                        subCategories,
                                        specsList,
                                        setSpecsList
                                    }: ProductFormProps) {

    // --- Local Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (name === "name" && !isEditMode) {
                setFormData(prev => ({ ...prev, slug: convertToSlug(value) }));
            }
        }
    }

    const handleRenderInputImages = () => {
        setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), { altText: "", imageUrl: "" }]
        }))
    }

    const handleRemoveInputImage = (index: number) => {
        setFormData(prevState => ({
            ...prevState,
            images: (prevState.images || []).filter((_, i) => i !== index)
        }))
    }

    const handleRenderInputSpecifications = () => {
        setSpecsList(prev => [...prev, { key: "", value: "" }]);
    }

    const handleRemoveInputSpecifications = (index: number) => {
        setSpecsList(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <>
            <div className={"mb-1"}>
                <label className={`form-label`}>Name product</label>
                <input className={"form-control"} value={formData.name} name={"name"} onChange={handleInputChange} />
            </div>

            <div className={"mb-1"}>
                <label className={"form-label"}>Category</label>
                <select className={"form-select"} name="categoryId" value={formData.categoryId || ""} onChange={handleInputChange}>
                    <option value="">-- Select Category --</option>
                    {subCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className={"mb-1"}>
                <label className={`form-label`}>Slug</label>
                <input className={"form-control"} name={`slug`} value={formData.slug} onChange={handleInputChange} />
            </div>

            <div className={"d-flex gap-5 align-items-center"}>
                <div>
                    <label className={`form-label`}>Quantity</label>
                    <input type={"number"} className={"form-control"} name={`quantity`} value={formData.quantity} onChange={handleInputChange} />
                </div>
                <div>
                    <label className={`form-label`}>Status</label>
                    <div className="form-check form-switch">
                        <input name="isActive" className="form-check-input" type="checkbox" role="switch" checked={formData.isActive} onChange={handleInputChange} />
                        <label className="form-check-label">{formData.isActive ? "Active" : "Inactive"}</label>
                    </div>
                </div>
            </div>

            <div className={"mb-1 d-flex align-items-center gap-3"}>
                <div>
                    <label className={`form-label`}>Price</label>
                    <input className={"form-control"} type={"number"} name={`price`} value={formData.price} onChange={handleInputChange} />
                </div>
                <div>
                    <label className={`form-label`}>Discount</label>
                    <input className={"form-control"} type={"number"} name={`discount`} value={formData.discount} onChange={handleInputChange} />
                </div>
            </div>

            <div className={"mb-1"}>
                <label className={"form-label"}>Description</label>
                <textarea className={"form-control"} rows={3} name={"description"} value={formData.description} onChange={handleInputChange} />
            </div>

            {/* IMAGES */}
            <div className={"mb-1 d-flex flex-column"}>
                <label className={"form-label fw-bold"}>Images</label>
                {formData.images?.map((item, index) => (
                    <div className={"input-group mb-2"} key={index}>
                        <label className={"input-group-text"}>Image</label>
                        <input className={"form-control"} value={item.altText || ""} placeholder={"Alt text"} onChange={(e) => { const newVal = e.target.value; setFormData(prev => ({ ...prev, images: (prev.images || []).map((img, i) => i === index ? { ...img, altText: newVal } : img) })); }} />
                        <input className={"form-control"} placeholder={"URL"} value={item.imageUrl || ""} onChange={(e) => { const newVal = e.target.value; setFormData(prev => ({ ...prev, images: (prev.images || []).map((img, i) => i === index ? { ...img, imageUrl: newVal } : img) })); }} />
                        <button className={"btn btn-danger"} onClick={() => handleRemoveInputImage(index)}>X</button>
                    </div>
                ))}
                <button className={"btn btn-light"} onClick={handleRenderInputImages}>+ Add Image</button>
            </div>

            {/* SPECIFICATIONS */}
            <div className={"mb-1 d-flex flex-column"}>
                <label className={"form-label fw-bold"}>Specifications</label>
                <div className={"input-group"}>
                    {specsList.map((item, index) => (
                        <div className={"input-group mb-2"} key={index}>
                            <label className={"input-group-text"}>Spec</label>
                            <input className={"form-control"} value={item.key} placeholder={"Key (e.g. CPU)"} onChange={(e) => { const newVal = e.target.value; setSpecsList(prev => prev.map((it, i) => i === index ? { ...it, key: newVal } : it)); }} />
                            <input className={"form-control"} placeholder={"Value (e.g. i7)"} value={item.value} onChange={(e) => { const newVal = e.target.value; setSpecsList(prev => prev.map((it, i) => i === index ? { ...it, value: newVal } : it)); }} />
                            <button className={"btn btn-danger"} onClick={() => handleRemoveInputSpecifications(index)}>X</button>
                        </div>
                    ))}
                </div>
                <button className={"btn btn-light"} onClick={handleRenderInputSpecifications}>+ Add Spec</button>
            </div>
        </>
    );
}