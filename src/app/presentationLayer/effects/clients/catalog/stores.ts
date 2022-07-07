import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList } from "app/businessLogicLayer/models/PaginationResponse";
import { UnitItem } from "app/businessLogicLayer/models/Unit";
import { ResponseErrorDataI } from "app/businessLogicLayer/models/Error";
import { FetchCatalogParamsType } from "app/businessLogicLayer/models/Client";
import { Vat } from "app/businessLogicLayer/models/Vat";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";


export const $syncCatalog = createStore({ loading: false, success: false, error: undefined })
  .on(effects.syncCatalogEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.syncCatalogEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetSyncCatalogEvent);

export const $catalog = createStore({ loading: false, data: null, error: undefined })
  .on(effects.fetchCatalogEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchCatalogEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(resetClientCard);


export const $catalogFilter = createStore<FetchCatalogParamsType>({})
  .on(events.updateCatalogFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetCatalogFilter)
  .reset(resetClientCard);


export const $createCategory = createStore({ loading: false, success: false, error: undefined })
  .on(effects.createCategoryEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createCategoryEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetCreateCategoryEvent);

export const $deleteCategory = createStore({ loading: false, success: false, error: undefined })
  .on(effects.deleteCategoryEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.deleteCategoryEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetDeleteCategoryEvent);


interface UnitsItemsStoreI {
  loading: boolean;
  data: UnitItem[];
  error: ResponseErrorDataI | undefined;
}

export const $unitsItems = createStore<UnitsItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchUnitsItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchUnitsItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

interface VatsItemsStoreI {
  loading: boolean;
  data: Vat[];
  error: ResponseErrorDataI | undefined;
}

export const $vatsItems = createStore<VatsItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchVatsItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchVatsItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

export const $catalogProducts = createStore({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchCatalogProductsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchCatalogProductsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetCatalogProductsEvent);

export const $currentProduct = createStore({ loading: false, data: null, error: undefined })
  .on(effects.fetchCurrentProductEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchCurrentProductEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetCurrentProductEvent);

export const $createCatalogProduct = createStore({ loading: false, success: false, error: undefined })
  .on(effects.createCatalogProductEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createCatalogProductEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetCreateCatalogProductEvent);

export const $updateCatalogProduct = createStore({ loading: null, success: false, error: undefined })
  .on(effects.updateCatalogProductEffect, (prevStore, payload) => {
    return {
      ...prevStore,
      loading: payload.id,
    };
  })
  .on(effects.updateCatalogProductEffect.done, (prevStore) => {
    return {
      ...prevStore,
      loading: null,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetUpdateCatalogProductEvent);

export const $deleteCatalogProduct = createStore({ loading: null, success: false, error: undefined })
  .on(effects.deleteCatalogProductEffect, (prevStore, payload) => {
    return {
      ...prevStore,
      loading: payload.id,
    };
  })
  .on(effects.deleteCatalogProductEffect.done, (prevStore) => {
    return {
      ...prevStore,
      loading: null,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetDeleteCatalogProductEvent);