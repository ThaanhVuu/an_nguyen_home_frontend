// components/DataTable.tsx
import React from "react";

export interface Column<T> {
    header: string;
    className?: string;
    accessor?: keyof T;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    selectedIds?: string[];
    onSelectAll?: (isChecked: boolean) => void;
    onSelectOne?: (id: string) => void;
    rowKey?: keyof T;
    emptyMessage?: string;
    // 🆕 THÊM MỚI: Chiều cao tối đa của bảng (VD: "400px", "60vh")
    maxHeight?: string;
}

export function TableCus<T extends { [key: string]: any }>({
                                                               data,
                                                               columns,
                                                               selectedIds = [],
                                                               onSelectAll,
                                                               onSelectOne,
                                                               rowKey = "id",
                                                               emptyMessage = "No data found.",
                                                               maxHeight = "500px" // 🆕 Nhận prop maxHeight
                                                           }: DataTableProps<T>) {

    const isAllSelected = data.length > 0 && data.every((item) => selectedIds.includes(item[rowKey]));

    return (
        <div
            className="table-responsive border rounded" // Thêm border cho đẹp khi cuộn
            // 🆕 Xử lý style để cuộn dọc
            style={maxHeight ? { maxHeight: maxHeight, overflowY: "auto", position: 'relative' } : {}}
        >
            <table className="table table-hover table-striped shadow-sm rounded align-middle mb-0 bg-white">
                <thead className="table-light">
                <tr>
                    {/* Cột Checkbox */}
                    {onSelectAll && (
                        <th
                            className="py-3 ps-4"
                            // 🆕 Sticky Header cho checkbox
                            style={{ width: "50px", position: "sticky", top: 0, zIndex: 10 }}
                        >
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(e) => onSelectAll(e.target.checked)}
                            />
                        </th>
                    )}

                    {/* Các cột dữ liệu */}
                    {columns.map((col, index) => (
                        <th
                            key={index}
                            className={`py-3 ${col.className || ""}`}
                            // 🆕 Sticky Header cho các cột nội dung
                            style={{ position: "sticky", top: 0, zIndex: 10 }}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((item) => {
                    const id = item[rowKey];
                    const isSelected = selectedIds.includes(id);

                    return (
                        <tr key={id} className={isSelected ? "table-active" : ""}>
                            {onSelectOne && (
                                <td className="ps-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onSelectOne(id)}
                                    />
                                </td>
                            )}
                            {columns.map((col, index) => (
                                <td key={index} className={col.className || ""}>
                                    {col.render
                                        ? col.render(item)
                                        : item[col.accessor as string]
                                    }
                                </td>
                            ))}
                        </tr>
                    );
                })}

                {data.length === 0 && (
                    <tr>
                        <td colSpan={columns.length + (onSelectAll ? 1 : 0)} className="text-center py-4 text-muted">
                            {emptyMessage}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}