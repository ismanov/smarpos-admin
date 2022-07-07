import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { User, UsersListFilterI } from "app/businessLogicLayer/models/User";
import { LoadingI, SuccessStoreI } from "app/businessLogicLayer/models";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";


interface StaffListStoreI extends LoadingI {
  data: PaginationResponse<User>;
}

export const $staffList = createStore<StaffListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchStaffListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchStaffListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchStaffListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $staffListFilter = createStore<UsersListFilterI>({  })
  .on(events.updateStaffListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetStaffListFilter);

export const $updateUser = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.updateUserEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.updateUserEffect.done, (state, result) => ({
    ...state,
    loading: false,
    success: true
  }))
  .on(effects.updateUserEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetUpdateUser);

export const $updateUserLogin = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.updateUserLoginEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.updateUserLoginEffect.done, (state, result) => ({
    ...state,
    loading: false,
    success: true
  }))
  .on(effects.updateUserLoginEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetUpdateUserLogin);

export const $expireToken = createStore({ loading: false, success: false, error: undefined })
  .on(effects.expireTokenEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.expireTokenEffect.done, (state, result) => ({
    ...state,
    loading: false,
    success: true
  }))
  .on(effects.expireTokenEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetExpireToken);