import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { User, UsersListFilterI } from "app/businessLogicLayer/models/User";
import { LoadingI, SuccessStoreI } from "app/businessLogicLayer/models";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";


interface UsersListStoreI extends LoadingI {
  data: PaginationResponse<User>;
}

export const $usersList = createStore<UsersListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchUsersListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchUsersListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchUsersListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $usersListFilter = createStore<UsersListFilterI>({ roles: ["ROLE_SMARTPOS_ADMIN"] })
  .on(events.updateUsersListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetUsersListFilter);


interface UserDetailsStoreI extends LoadingI {
  data: User | null;
}

export const $userDetails = createStore<UserDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchUserDetailsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.fetchUserDetailsEffect.done, (prevStore, response) => {
    return {
      ...prevStore,
      data: response.result,
      error: undefined
    };
  })
  .on(effects.fetchUserDetailsEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetUserDetails);


export const $createUser = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.createUserEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createUserEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .on(effects.createUserEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetCreateUser);


export const $updateUser = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.updateUserEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateUserEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .on(effects.updateUserEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetUpdateUser);