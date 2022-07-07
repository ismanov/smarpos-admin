import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { LoadingI } from "app/businessLogicLayer/models";
import { User } from "app/businessLogicLayer/models/User";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";
import { notification } from 'antd';


// Users components

interface UsersListStoreI extends LoadingI {
  data: PaginationResponse<User>;
}

export const $branchesList = createStore<any>({ loading: false, data: new PaginationList(), error: undefined })
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
  }))
  .reset(resetClientCard);
  
export const $authoritiesList = createStore<Array<effects.roleType>>([])
  .on(effects.fetchAuthoritiesListEffects.done, (_, result) =>{
    return  ([...result.result])
  })
  .reset(resetClientCard);

export const $usersFilter = createStore({})
  .on(events.updateUsersFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetUsersFilter)
  .reset(resetClientCard);

export const $createUser = createStore({success: false,})
  .on(effects.createCompanyUser, (prevStore, props) => ({ ...prevStore, ...props, success:false }))
  .on(effects.createCompanyUser.done, (prevStore, props) => {
    notification["success"]({
      message: "Сотрудник добавлен!",
    });
    return ({ ...prevStore, ...props, success: true })
  })
  .on(effects.createCompanyUser.fail, (state, result) => {
    if(result.error.response){console.log(result.error.response.data);
      notification["error"]({
        message: result.error.response.data.title,
      });}
    return ({ ...state,  success: false })
  })
  .reset(resetClientCard);
