export const convertToSlug = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')     // Xóa ký tự đặc biệt
        .replace(/[\s_-]+/g, '-')     // Thay khoảng trắng/gạch dưới thành gạch ngang
        .replace(/^-+|-+$/g, '');     // Xóa gạch ngang thừa ở đầu/cuối
};