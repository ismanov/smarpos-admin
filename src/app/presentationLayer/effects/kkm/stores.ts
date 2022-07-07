import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { KkmsListFilterI, KKM } from "app/businessLogicLayer/models/KKM";
import { LoadingI, SuccessStoreI } from "app/businessLogicLayer/models";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";


interface KkmListStoreI extends LoadingI {
  data: PaginationResponse<KKM>;
}

export const $kkmList = createStore<KkmListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchKkmListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchKkmListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchKkmListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $kkmListFilter = createStore<KkmsListFilterI>({  })
  .on(events.updateKkmListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetKkmListFilter);

export const $syncKkm = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.syncKkmEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.syncKkmEffect.done, (state, result) => ({
    ...state,
    loading: false,
    success: true
  }))
  .on(effects.syncKkmEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetSyncKkm);

export const $deleteKkm = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.deleteKkmEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.deleteKkmEffect.done, (state, result) => ({
    ...state,
    loading: false,
    success: true
  }))
  .on(effects.deleteKkmEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetDeleteKkm);