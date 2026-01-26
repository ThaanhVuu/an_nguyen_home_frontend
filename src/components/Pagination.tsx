import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
}

export const Pagination = ({
                               currentPage,
                               totalPages,
                               pageSize,
                               totalElements,
                               onPageChange,
                               onSizeChange,
                               pageSizeOptions = [5, 10, 20, 50]
                           }: PaginationProps) => {

    // Tính toán hiển thị "Showing X to Y of Z"
    const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

    // --- HÀM MỚI: Xử lý chuyển trang kèm Scroll ---
    const handlePageClick = (pageNumber: number) => {
        // 1. Gọi hàm xử lý logic của cha (fetch data)
        onPageChange(pageNumber);

        // 2. Scroll lên đầu trang
        window.scrollTo({
            top: 0,
            behavior: "smooth" // "smooth" để trượt mượt mà, hoặc "auto" để nhảy ngay lập tức
        });
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-3 p-2 bg-light rounded border">
            {/* Bên trái: Chọn Size */}
            <div className="d-flex align-items-center gap-3">
                <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                    value={pageSize}
                    onChange={(e) => {
                        onSizeChange(Number(e.target.value));
                        // Opsional: Nếu đổi size cũng muốn scroll lên top thì gọi lệnh scroll ở đây luôn
                        // window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
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
                            // SỬ DỤNG HÀM MỚI Ở ĐÂY
                            onClick={() => handlePageClick(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            &laquo;
                        </button>
                    </li>

                    {/* Danh sách các trang */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                // SỬ DỤNG HÀM MỚI Ở ĐÂY
                                onClick={() => handlePageClick(index)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    {/* Nút Next */}
                    <li className={`page-item ${currentPage === totalPages - 1 || totalPages === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            // SỬ DỤNG HÀM MỚI Ở ĐÂY
                            onClick={() => handlePageClick(currentPage + 1)}
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