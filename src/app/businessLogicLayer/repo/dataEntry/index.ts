import instance from "app/businessLogicLayer/config/api";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { DataEntryModel, DataEntryType, DataEntryFilter } from 'app/businessLogicLayer/models/DataEntryModel'

interface DataEntryRepo {
    fetchDataEntry(filter: DataEntryFilter): Promise<PaginationResponse<DataEntryModel>>
    fetchDataEntryTypeList(): Promise<Array<DataEntryType>>
    createDataEntry(dataEntry: DataEntryModel): Promise<void>
    updateDataEntry(dataEntry: DataEntryModel): Promise<void>
    fetchDataEntryById(id: number): Promise<DataEntryModel>
}

export default class DataEntryRepoImpl implements DataEntryRepo {
    
    fetchDataEntry(filter: DataEntryFilter): Promise<PaginationResponse<DataEntryModel>> {
        return instance.httpGet<PaginationResponse<DataEntryModel>>('/api/data-entry', filter)        
    }
    
    fetchDataEntryTypeList(): Promise<Array<DataEntryType>> {
        return instance.httpGet<Array<DataEntryType>>('/api/data-entry/types')
    }

    createDataEntry(dataEntry: DataEntryModel): Promise<void> {
        return instance.httpPost<void>('/api/data-entry', dataEntry)
    }

    updateDataEntry(dataEntry: DataEntryModel): Promise<void> {
        return instance.httpPut('/api/data-entry', dataEntry)
    }

    fetchDataEntryById(id: number): Promise<DataEntryModel> {
        return instance.httpGet<DataEntryModel>(`/api/data-entry/${id}`)
    }

    removeDataEntry(id: number): Promise<void> {
        return instance.httpDelete<void>(`/api/data-entry/${id}`)
    }

}