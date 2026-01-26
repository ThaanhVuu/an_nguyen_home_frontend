export interface PaginationData<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}