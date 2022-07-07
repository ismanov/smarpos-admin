import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Client } from "app/businessLogicLayer/models/Client";
import { BranchItem } from "app/businessLogicLayer/models/Branch";
import { LoadingI } from "app/businessLogicLayer/models";
import { Role } from "app/businessLogicLayer/models/Role";


interface CompanyItemsStoreType extends LoadingI {
  data: PaginationResponse<Client>;
}

export const $companyItems = createStore<CompanyItemsStoreType>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.searchCompanyItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.searchCompanyItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetCompanyItemsEvent);

interface BranchItemsStoreType extends LoadingI {
  data: BranchItem[];
}

export const $branchItems = createStore<BranchItemsStoreType>({ loading: false, data: [], error: undefined })
  .on(effects.fetchBranchItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchBranchItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetBranchItemsEvent);


interface UsersRolesStoreType extends LoadingI {
  data: Role[];
}

export const $usersRoles = createStore<UsersRolesStoreType>({ loading: false, data: [], error: undefined })
  .on(effects.fetchUsersRolesEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchUsersRolesEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

  export const $createAndUpdateTerminalInfo = createStore<any>({ loading: false, success: null, error: undefined })
  .on(effects.createAndUpdateTerminalEffect, (state) => ({
    ...state,
    success: null,
    error: undefined,
    loading: true
  }))
  .on(effects.createAndUpdateTerminalEffect.done, (state, result) => ({
    ...state,
    loading: false,
    success: true
  }))
  .on(effects.createAndUpdateTerminalEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result?.error?.response?.data,
  }))
  .reset(events.resetCreateAndUpdateInfo);