import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { User, UsersListFilterI } from "app/businessLogicLayer/models/User";
import { LoadingI } from "app/businessLogicLayer/models";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";


interface TgUsersListStoreI extends LoadingI {
  data: PaginationResponse<User>;
}

export const $tgUsersList = createStore<TgUsersListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchTgUsersListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchTgUsersListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchTgUsersListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $tgUsersListFilter = createStore<UsersListFilterI>({  })
  .on(events.updateTgUsersListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetTgUsersListFilter);