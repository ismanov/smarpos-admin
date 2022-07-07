import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { SearchProductI } from "app/businessLogicLayer/models/Product";
import {
  WarehouseIncomeModel,
  WarehouseStockByDayModel,
  WarehouseStockByDayListFilterType,
  WarehouseStockListFilterType,
  WarehouseStockModel,
  WarehouseStockStatModel, WarehouseIncomesListFilterType, WarehouseStatI
} from "app/businessLogicLayer/models/Client";
import { ResponseErrorDataI } from "app/businessLogicLayer/models/Error";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";


interface WarehouseStatType {
  loading: boolean;
  data: WarehouseStatI | null;
  error: ResponseErrorDataI | undefined;
}

export const $warehouseStat = createStore<WarehouseStatType>({ loading: false, data: null, error: undefined })
  .on(effects.fetchWarehouseStatEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchWarehouseStatEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(resetClientCard);


interface SearchProductsStoreI {
  loading: boolean;
  data: SearchProductI[];
  error: ResponseErrorDataI | undefined;
}

export const $searchProducts = createStore<SearchProductsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.searchProductsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.searchProductsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetSearchProducts);

interface WarehouseStockListStoreI {
  loading: boolean;
  data: PaginationResponse<WarehouseStockModel>;
  error: ResponseErrorDataI | undefined;
}

export const $warehouseStockList = createStore<WarehouseStockListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchWarehouseStockListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchWarehouseStockListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(resetClientCard);


export const $warehouseStockListFilter = createStore<WarehouseStockListFilterType>({})
  .on(events.updateWarehouseStockListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetWarehouseStockListFilter)
  .reset(resetClientCard);


interface WarehouseStockStatType {
  loading: boolean;
  data: WarehouseStockStatModel | null;
  error: ResponseErrorDataI | undefined;
}

export const $warehouseStockStat = createStore<WarehouseStockStatType>({ loading: false, data: null, error: undefined })
  .on(effects.fetchWarehouseStockStatEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchWarehouseStockStatEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));


interface WarehouseStockByDayListStoreI {
  loading: boolean;
  data: PaginationResponse<WarehouseStockByDayModel>;
  error: ResponseErrorDataI | undefined;
}

export const $warehouseStockByDayList = createStore<WarehouseStockByDayListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchWarehouseStockByDayListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchWarehouseStockByDayListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(resetClientCard);


export const $warehouseStockByDayListFilter = createStore<WarehouseStockByDayListFilterType>({})
  .on(events.updateWarehouseStockByDayListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetWarehouseStockByDayListFilter)
  .reset(resetClientCard);


interface WarehouseIncomesListStoreI {
  loading: boolean;
  data:  PaginationResponse<WarehouseIncomeModel>;
  error: ResponseErrorDataI | undefined;
}

export const $warehouseIncomesList = createStore<WarehouseIncomesListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchWarehouseIncomesListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchWarehouseIncomesListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(resetClientCard);


export const $warehouseIncomesListFilter = createStore<WarehouseIncomesListFilterType>({})
  .on(events.updateWarehouseIncomesListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetWarehouseIncomesListFilter)
  .reset(resetClientCard);


export const $createWarehouseIncome = createStore({ loading: false, success: false, error: undefined })
  .on(effects.createWarehouseIncomeEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createWarehouseIncomeEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetCreateWarehouseIncomeEvent);


export const $createWarehouseOrder = createStore({ loading: false, success: false, error: undefined })
  .on(effects.createWarehouseOrderEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createWarehouseOrderEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetCreateWarehouseOrderEvent);