import { createStore } from 'effector';
import * as effects from './effects';
import * as events from './events';

import { LoadingI } from "app/businessLogicLayer/models";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { DataEntryModel, DataEntryType, DataEntryFilter, DataEntryModelItem } from 'app/businessLogicLayer/models/DataEntryModel';
import { BranchItem } from 'app/businessLogicLayer/models/Branch';


interface DataEntryStore extends LoadingI {
    data?: PaginationResponse<DataEntryModel>,
    branchList: Array<BranchItem>,
    dataEntryTypes: Array<DataEntryType>,
    filters?: DataEntryFilter,
    itemsMap?: Map<number, DataEntryModelItem[]>
};

const dataEntryStore = createStore<DataEntryStore>({ 
        loading: false, 
        data: undefined, 
        branchList: [], 
        dataEntryTypes: [], 
        error: undefined,
        filters: {page: 0, size: 20},
        itemsMap: new Map()
    })
    .on(effects.fetchDataEntryTypes.done, (state, result) => ({
        ...state,
        dataEntryTypes: result.result
    }))
    .on(effects.fetchDataEntryTypes.fail, (state, result) => ({
        ...state,
        error: result.error.response && result.error.response.data
    }))
    .on(effects.fetchDataEntryList, (state) => ({
        ...state,
        loading: true
    }))
    .on(effects.fetchDataEntryList.done, (state, result) => ({
        ...state,
        loading: false,
        data: result.result
    }))
    .on(effects.fetchDataEntryList.fail, (state, result) => ({
        ...state,
        loading: false,
        error: result.error.response && result.error.response.data
    }))
    .on(effects.fetchBranchList.done, (state, result) => ({
        ...state,
        branchList: result.result
    }))
    .on(effects.fetchBranchList.fail, (state, result) => ({
        ...state,
        error: result.error.response && result.error.response.data
    }))
    .on(effects.createDataEntry, (state) => ({
        ...state,
        loading: true
    }))
    .on(effects.createDataEntry.done, (state) => {
        effects.fetchDataEntryList(state.filters || {})
        return {
            ...state,
            loading: false
        }
    })
    .on(effects.createDataEntry.fail, (state, result) => ({
        ...state,
        loading: false,
        error: result.error.response && result.error.response.data
    }))
    .on(effects.updateDataEntry.done, (state) => {
        effects.fetchDataEntryList(state.filters || {})
        return {
            ...state,
            loading: false
        }
    })
    .on(effects.updateDataEntry.fail, (state, result) => ({
        ...state,
        loading: false,
        error: result.error.response && result.error.response.data
    }))
    .on(effects.removeDataEntry.done, (state) => {
        effects.fetchDataEntryList(state.filters || {})
        return {
            ...state,
            loading: false
        }
    })
    .on(effects.removeDataEntry.fail, (state, result) => ({
        ...state,
        loading: false,
        error: result.error.response && result.error.response.data
    }))
    .on(events.updateFilter, (state, filter) => {
        effects.fetchDataEntryList(filter);
        return ({...state, ...filter});
    })
    .on(effects.fetchDataEntryById.done, (state, result) => {
        const { itemsMap } = state;
        itemsMap?.set(result.params, result.result.items || [])
        return ({...state, itemsMap});
    })
    .on(events.resetError, (state, _) => ({
        ...state,
        error: undefined
    }))
    .reset(events.resetStore)

export default dataEntryStore;