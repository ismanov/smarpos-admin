export interface Category {
    children?: Array<Category>,
    enabled?: boolean,
    id?: number,
    name?: string,
    parentId?: number,
    productCount?: number
}

export interface FetchCategoryItemsI {
    companyId: number
    branchId: number
    search?: string;
}

export interface CategoryItem {
    id: number;
    name: string;
    description: string;
}