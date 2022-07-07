import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { LoadingI } from "app/businessLogicLayer/models";
import { Branch, BranchesListFilterI } from "app/businessLogicLayer/models/Branch";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";


// Branches components

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
  }))
  .reset(resetClientCard);

export const $branchesFilter = createStore<BranchesListFilterI>({})
  .on(events.updateBranchesFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetBranchesFilter)
  .reset(resetClientCard);