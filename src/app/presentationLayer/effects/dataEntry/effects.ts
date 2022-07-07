import { createEffect } from 'effector';
import { AxiosError } from 'axios';
import Repository from '../../../businessLogicLayer/repo';
import { FetchBranchItemsType, BranchItem } from 'app/businessLogicLayer/models/Branch';
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { DataEntryModel, DataEntryType, DataEntryFilter } from 'app/businessLogicLayer/models/DataEntryModel';

export const fetchBranchList = createEffect<FetchBranchItemsType, BranchItem[], AxiosError>().use(async params => {    
    return await Repository.branch.fetchBranchItems(params)
});

export const fetchDataEntryList = createEffect<DataEntryFilter, PaginationResponse<DataEntryModel>, AxiosError>({ handler: Repository.dataEntry.fetchDataEntry});

export const createDataEntry = createEffect<DataEntryModel, void, AxiosError>({ handler: Repository.dataEntry.createDataEntry });

export const updateDataEntry = createEffect<DataEntryModel, void, AxiosError>({ handler: Repository.dataEntry.updateDataEntry });

export const removeDataEntry = createEffect<number, void, AxiosError>({ handler: Repository.dataEntry.removeDataEntry });

export const fetchDataEntryById = createEffect<number, DataEntryModel, AxiosError>({ handler: Repository.dataEntry.fetchDataEntryById });

export const fetchDataEntryTypes = createEffect<void, DataEntryType[], AxiosError>({ handler: Repository.dataEntry.fetchDataEntryTypeList });