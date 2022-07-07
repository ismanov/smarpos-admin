export interface Log {
    companyId: number;
    id: number;
    entityType: string;
    entityID: number;
    entityName: string;
    updater: string;
    field: string;
    modificationDate: string;
    oldValue?: string;
    newValue?: string;
}

export interface LogsListFilterI {
    companyId?: number;
    page?: number
    size?: number
}

export interface FetchLogsListParamsType extends LogsListFilterI {}