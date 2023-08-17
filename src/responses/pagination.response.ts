export interface PaginationResponse<T = any> {
	data: T;
	pagination: { totalPages: number; totalCount: number };
}
