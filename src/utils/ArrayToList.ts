// 1. Chuyển từ Object (Backend) -> Array (Frontend hiển thị)
// Input: { "CPU": "Core i7", "RAM": "16GB" }
// Output: [ { key: "CPU", value: "Core i7" }, { key: "RAM", value: "16GB" } ]
export const convertSpecsToArray = (specsObj: any) => {
    if (!specsObj) return [];
    return Object.entries(specsObj).map(([key, value]) => ({
        key: key,
        value: String(value) // Đảm bảo value là string
    }));
};

// 2. Chuyển từ Array (Frontend) -> Object (Backend lưu)
// Input: [ { key: "CPU", value: "Core i7" }, { key: "RAM", value: "16GB" } ]
// Output: { "CPU": "Core i7", "RAM": "16GB" }
export const convertSpecsToObject = (specsArray: any[]) => {
    const obj: Record<string, string> = {};
    specsArray?.forEach(item => {
        // Chỉ lấy những dòng có key để tránh lỗi key rỗng
        if (item.key && item.key.trim() !== "") {
            obj[item.key] = item.value;
        }
    });
    return obj;
};