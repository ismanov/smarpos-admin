export interface DataEntryModel {
    id?: number,
    company: { id: number, name?: string }
    status?: string
    items: Array<DataEntryModelItem>
}


export interface DataEntryModelItem {
    branchId?: number
    branchName?: string
    count?: number
    existingCount?: number
    type?: string,
    typeName?: string
}

export interface DataEntryType {
    name: string
    description: string
}

export interface DataEntryFilter {
    branchId?: number
    companyId?: number
    es?: boolean
    from?: string
    orderBy?: string
    page?: number
    size?: number
    search?: string
    sortOrder?: string
    terminalId?: number
    to?: string
    userId?: number
}