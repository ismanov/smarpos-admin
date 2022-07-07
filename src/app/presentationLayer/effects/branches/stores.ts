import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { LoadingI } from "app/businessLogicLayer/models";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Branch, BranchesListFilterI, MapBranchI } from "app/businessLogicLayer/models/Branch";


interface BranchesListStoreI extends LoadingI {
  data: PaginationResponse<Branch>;
}

export const $branchesList = createStore<BranchesListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchBranchesListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchBranchesListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchBranchesListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $branchesListFilter = createStore<BranchesListFilterI>({  })
  .on(events.updateBranchesListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetBranchesListFilter);


interface BranchesListMapStoreI extends LoadingI {
  data: MapBranchI[];
}

export const $branchesListMap = createStore<BranchesListMapStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchBranchesListMapEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchBranchesListMapEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchBranchesListMapEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));