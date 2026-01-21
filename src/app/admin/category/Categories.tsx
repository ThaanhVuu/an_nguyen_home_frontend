"use client";
import React, {useState} from "react";
import useCategories, {Category} from "@/app/admin/category/useCategories";
import {Column, TableCus} from "@/components/TableCus";
import {useModal} from "@/hooks/useModalClient";
import ModalClient from "@/components/modal/ModalClient";
import {Pagination} from "@/components/Pagination";
import Toast, {ToastType} from "@/components/Toast";

const INIT_CATE = {
    id: "",
    isActive: true,
    name: "",
    parentId: "",
    parentName: "",
    slug: "",
}

export default function Categories() {
    // 2. Local state for the form
    const [formData, setFormData] = useState<Category>(INIT_CATE);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("error")
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        categories,
        pagination,
        setFilter,
        setKeyword,
        setPage,
        setSize,
        rootCategories,
        insertCategory,
        updateCategory,
        deleteCategory
    } = useCategories();

    const MODAL_ID = "category_modal";
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [tempSearch, setTempSearch] = useState("");
    const {open, close} = useModal(MODAL_ID);

    const columns: Column<Category>[] = [
        {
            header: "Name",
            className: "fw-bold text-primary",
            accessor: "name",
        },
        {
            header: "Slug",
            className: "text-muted",
            accessor: "slug",
        },
        {
            header: "Type",
            render: (item) =>
                item.parentId ? (
                    <span className="badge bg-info bg-opacity-10 text-info">Sub Category</span>
                ) : (
                    <span className="badge bg-primary bg-opacity-10 text-primary">Root Category</span>
                ),
        },
        {
            header: "Parent",
            render: (item) => item.parentName || <span className="text-muted fst-italic">root</span>,
        },
        {
            header: "Status",
            className: "text-center",
            render: (item) => (
                <span className={`badge rounded-pill ${item.isActive ? "bg-success" : "bg-secondary"}`}>
                    {item.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
    ];

    // --- Handlers ---

    // Handle Form Input Change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;

        // Handle checkbox separately
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({...prev, [name]: checked}));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };

    // Handle Search
    const handleEnterKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setKeyword(tempSearch);
            setPage(0); // Reset to page 1 on new search
        }
    };

    // Table Selection
    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds((prev) => prev.filter((x) => x !== id));
        else setSelectedIds((prev) => [...prev, id]);
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) setSelectedIds(categories.map((c) => c.id));
        else setSelectedIds([]);
    };

    // Actions
    const handleCreate = () => {
        setFormData(INIT_CATE);
        setIsEditMode(false);
        open();
    };

    const handleUpdate = () => {
        if (selectedIds.length !== 1) {
            alert("Please select exactly one category to update.");
            return;
        }
        const categoryToEdit = categories.find(c => c.id === selectedIds[0]);
        if (categoryToEdit) {
            setFormData(categoryToEdit);
            setIsEditMode(true);
            open();
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
            try{
                await deleteCategory(selectedIds)
                setToastType("success");
                setToastMsg("Delete success");
                setSelectedIds([]); // Clear selection after delete
            }catch (e: any){
                setToastType("error")
                setToastMsg(e);
            }
        }
    }

    const handleSave = async () => {
        try {
            if (isEditMode) {
                await updateCategory(formData);
            } else {
                await insertCategory(formData);
            }

            setToastType("success");
            setToastMsg(`${isEditMode ? "Updated" : "Inserted"} success`);

            close();
        } catch (e: any){
            const message: string = e.response?.data?.message || "Something went wrong";
            setToastType("error")
            setToastMsg(message);
        }
    };

    const handleSizeChange = (newSize: number) => {
        setSize(newSize);
        setPage(0); // Reset về trang 1 khi đổi số lượng hiển thị
    };

    // --- Render Helpers ---

    const renderModalFooter = (
        <div>
            <button type="button" className="btn btn-secondary me-2" onClick={close}>
                Cancel
            </button>
            <button type="button" className="btn btn-success" onClick={handleSave}>
                {isEditMode ? "Update" : "Save"}
            </button>
        </div>
    );

    return (
        <section className="row container-fluid align-items-start mt-5">
            {/* Sidebar / Tools */}
            <aside className="col-2 d-flex flex-column gap-3">
                <span className="h4 fw-bold mt-2 mb-1">Category</span>

                <button className="btn-success btn w-100" onClick={handleCreate}>
                    Add +
                </button>

                <div className="d-flex gap-3">
                    <button
                        className="btn-primary btn w-50 text-nowrap"
                        onClick={handleUpdate}
                        disabled={selectedIds.length !== 1} // Disable if not exactly 1 selected
                    >
                        Update
                    </button>
                    <button
                        className="btn-danger btn w-50 text-nowrap"
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0}
                    >
                        Delete
                    </button>
                </div>

                <div className="card">
                    <div className="card-header">Search</div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <input
                                className="form-control"
                                placeholder="Type & Enter..."
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                                onKeyDown={handleEnterKeydown} // Added Keydown handler
                            />
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <div className="card-header">Filter</div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <select className="form-select" onChange={(e) => setFilter(e.target.value)}>
                                <option value="">All</option>
                                <option value="root">Root Categories</option>
                                <option value="hasParent">Sub Categories</option>
                                {/* Note: This only filters based on currently loaded categories due to pagination */}
                                {categories
                                    .filter((cat) => cat.parentName == null)
                                    .map((item) => (
                                        <option value={item.id} key={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Table */}
            <div className="col-10 mt-3">
                <TableCus
                    data={categories}
                    columns={columns}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                    maxHeight={"500px"}
                />

                <Pagination currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            pageSize={pagination.size}
                            totalElements={pagination.totalElements}
                            onPageChange={setPage}
                            onSizeChange={handleSizeChange}
                />
            </div>

            {/* Modal */}
            <ModalClient id={MODAL_ID} footer={renderModalFooter}
                         title={isEditMode ? "Update Category" : "Insert New Category"}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        name="name"
                        className="form-control"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Slug</label>
                    <input
                        name="slug"
                        className="form-control"
                        value={formData.slug || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Parent Category</label>
                    <select
                        name="parentId"
                        className="form-select"
                        value={formData.parentId || ""}
                        onChange={handleInputChange}
                    >
                        <option value="">None</option>
                        {rootCategories
                            .map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <div className="form-check form-switch">
                        <input
                            name="isActive"
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                        />
                        <label className="form-check-label">{formData.isActive ? "Active" : "Inactive"}</label>
                    </div>
                </div>
            </ModalClient>
            {toastMsg && (
                <Toast
                    message={toastMsg}
                    type={toastType}
                    position="top-center"
                    onClose={() => setToastMsg(null)}
                />
            )}
        </section>
    );
}