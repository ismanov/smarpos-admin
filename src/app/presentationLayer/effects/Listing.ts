export type Listing<T> = {
    list?: Array<T>,
    page?: number,
    size?: number,
    totalElements?: number,
    isLoading?: boolean,
    totalPages?: number
}
