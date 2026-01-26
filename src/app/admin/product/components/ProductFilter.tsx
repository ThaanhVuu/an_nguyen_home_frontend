import React from "react";
import {Category} from "@/app/admin/category/useCategories"; // Đảm bảo import đúng interface Category

interface ProductFilterProps {
    tempSearch: string;
    setTempSearch: (val: string) => void;
    handleEnterKeydown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    filterInputs: {
        category: string;
        priceFrom: number | "";
        priceTo: number | "";
        status: string;
    };
    setFilterInputs: React.Dispatch<React.SetStateAction<any>>;
    onApply: () => void;
    onReset: () => void;
    subCategories: Category[];
    sortInputs: {
        sortBy: string,
        sortType: "asc" | "desc"
    };
    setSortInput: React.Dispatch<any>
}

export default function ProductFilter({
                                          tempSearch,
                                          setTempSearch,
                                          handleEnterKeydown,
                                          filterInputs,
                                          setFilterInputs,
                                          onApply,
                                          onReset,
                                          subCategories,
                                          sortInputs,
                                          setSortInput
                                      }: ProductFilterProps) {
    return (
        <>
            {/* Search Card */}
            <div className="card shadow-sm border">
                <div className="card-header bg-light fw-bold small text-uppercase">Search</div>
                <div className="card-body p-1">
                    <input
                        className="form-control"
                        placeholder="Type & Enter..."
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        onKeyDown={handleEnterKeydown}
                    />
                </div>
            </div>

            {/* Filter Card */}
            <div className="card shadow-sm border">
                <div className="card-header bg-light fw-bold small text-uppercase">Filter</div>
                <div className="card-body p-1">
                    {/* Category */}
                    <div className="mb-2">
                        <label className="small fw-bold">Category</label>
                        <select
                            className="form-select form-select-sm"
                            value={filterInputs.category}
                            onChange={(e) => setFilterInputs({...filterInputs, category: e.target.value})}
                        >
                            <option value="">All Categories</option>
                            {subCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="mb-2">
                        <label className="small fw-bold">Price Range</label>
                        <div className="d-flex gap-1">
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="From"
                                value={filterInputs.priceFrom}
                                onChange={(e) => setFilterInputs({
                                    ...filterInputs,
                                    priceFrom: e.target.value ? Number(e.target.value) : ""
                                })}
                            />
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="To"
                                value={filterInputs.priceTo}
                                onChange={(e) => setFilterInputs({
                                    ...filterInputs,
                                    priceTo: e.target.value ? Number(e.target.value) : ""
                                })}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mb-2">
                        <label className="small fw-bold">Status</label>
                        <select
                            className="form-select form-select-sm"
                            value={filterInputs.status}
                            onChange={(e) => setFilterInputs({...filterInputs, status: e.target.value})}
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Disable</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-sm btn-primary w-100 fw-bold" onClick={onApply}>APPLY</button>
                        <button className="btn btn-sm btn-outline-secondary w-100" onClick={onReset}>RESET</button>
                    </div>
                </div>
            </div>

            <div className={"card shadow-sm border"}>
                <div className="card-header bg-light fw-bold small text-uppercase">Sort</div>
                <div className={"card-body p-1 d-flex gap-1"}>
                    <div className={"w-50"}>
                        <label className={"small fw-bold"}>Sort Type</label>
                        <select className={"form-select form-select-sm"} onChange={(e) => setSortInput({...sortInputs, sortType: e.target.value})}>
                            <option value={"asc"}>ASC</option>
                            <option value={"desc"}>DESC</option>
                        </select>
                    </div>
                    <div className={"w-50"}>
                        <label className={"small fw-bold"}>Sort By</label>
                        <select className={"form-select form-select-sm"} onChange={(e) => setSortInput({...sortInputs, sortBy: e.target.value})}>
                            <option value={"price"}>Price</option>
                            <option value={"name"}>Alphabet</option>
                            <option value={"quantity"}>Quantity</option>
                            <option value={"createdAt"}>Created Date</option>
                            <option value={"updatedAt"}>Updated Date</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}