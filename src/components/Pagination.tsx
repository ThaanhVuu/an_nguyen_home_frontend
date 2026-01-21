import React from "react";

interface PaginationProps {
    currentPage: number;      // Trang hiện tại (0-based)
    totalPages: number;       // Tổng số trang
    pageSize: number;         // Kích thước trang (size)
    totalElements: number;    // Tổng số bản ghi
    onPageChange: (page: number) => void; // Hàm xử lý khi chuyển trang
    onSizeChange: (size: number) => void; // Hàm xử lý khi đổi size
    pageSizeOptions?: number[]; // Các option cho select size (tùy chọn)
}

export const Pagination = ({
                               currentPage,
                               totalPages,
                               pageSize,
                               totalElements,
                               onPageChange,
                               onSizeChange,
                               pageSizeOptions = [5, 10, 20, 50] // Mặc định
                           }: PaginationProps) => {

    // Tính toán hiển thị "Showing X to Y of Z"
    const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="d-flex justify-content-between align-items-center mt-3 p-2 bg-light rounded border">
            {/* Bên trái: Chọn Size và hiển thị thông tin */}
            <div className="d-flex align-items-center gap-3">
                <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                    value={pageSize}
                    onChange={(e) => onSizeChange(Number(e.target.value))}
                >
                    {pageSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>

                <span className="text-muted small">
                    Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
                    <strong>{totalElements}</strong> entries
                </span>
            </div>

            {/* Bên phải: Các nút bấm chuyển trang */}
            <nav aria-label="Page navigation">
                <ul className="pagination pagination-sm mb-0">
                    {/* Nút Previous */}
                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            &laquo;
                        </button>
                    </li>

                    {/* Danh sách các trang (Cơ bản) */}
                    {/* Lưu ý: Nếu totalPages quá lớn (ví dụ 100), bạn nên xử lý logic hiển thị dấu "..." ở đây */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => onPageChange(index)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    {/* Nút Next */}
                    <li className={`page-item ${currentPage === totalPages - 1 || totalPages === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1 || totalPages === 0}
                        >
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};