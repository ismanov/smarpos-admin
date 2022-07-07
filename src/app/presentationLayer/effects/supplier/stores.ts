import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { SUPPLIER, SupplierListFilterI, SupplierOrder, SupplierDetailsOrdersListFilterI, SupplierCurrentOrder } from "app/businessLogicLayer/models/Supplier";
import { LoadingI } from "app/businessLogicLayer/models";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";


// SUPPLIERS-LIST

interface SupplierListStoreI extends LoadingI {
  data: PaginationResponse<SUPPLIER>;
}

export const $supplierList = createStore<SupplierListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchSupplierListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchSupplierListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchSupplierListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $supplierListFilter = createStore<SupplierListFilterI>({  })
  .on(events.updateSupplierListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetSupplierListFilter);


// SUPPLIERS-DETAILS

interface SupplierDetailsStoreI extends LoadingI {
  data: SUPPLIER | null;
}

export const $supplierDetails = createStore<SupplierDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchSupplierDetailsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchSupplierDetailsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetSupplierCard);

interface SupplierDetailsOrdersStoreI extends LoadingI {
  data: PaginationResponse<SupplierOrder>;
}

export const $supplierDetailsOrdersList = createStore<SupplierDetailsOrdersStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchSupplierDetailsOrdersListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchSupplierDetailsOrdersListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchSupplierDetailsOrdersListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetSupplierCard);


export const $supplierDetailsOrdersListFilterProps = createStore<SupplierDetailsOrdersListFilterI>({  })
  .on(events.updateSupplierDetailsOrdersListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetSupplierDetailsOrdersListFilter)
  .reset(events.resetSupplierCard);


// Current order
interface SupplierDetailsCurrentOrderStoreI extends LoadingI {
  data: SupplierCurrentOrder | null
}

export const $supplierDetailsCurrentOrder = createStore<SupplierDetailsCurrentOrderStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchSupplierDetailsCurrentOrderEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchSupplierDetailsCurrentOrderEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchSupplierDetailsCurrentOrderEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetSupplierDetailsCurrentOrder)
  .reset(events.resetSupplierCard);