import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { ProductUnitI, SearchProductI } from "app/businessLogicLayer/models/Product";
import {
  PromotionDetailsI,
  PromotionListItemI,
  PromotionsListFilterType,
  PromotionStats
} from "app/businessLogicLayer/models/Promotions";
import { ResponseErrorDataI } from "app/businessLogicLayer/models/Error";
import { LoadingI } from "app/businessLogicLayer/models";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";

interface PromotionsListStoreI {
  loading: boolean;
  data: PaginationResponse<PromotionListItemI>;
  error: ResponseErrorDataI | undefined;
}

export const $promotionsList = createStore<PromotionsListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchPromotionsListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchPromotionsListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetPromotionsListEvent)
  .reset(resetClientCard);


export const $promotionsListFilter = createStore<PromotionsListFilterType>({})
  .on(events.updatePromotionsListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetPromotionsListFilter)
  .reset(resetClientCard);


interface PromotionsStatsStoreI {
  loading: boolean;
  data: PromotionStats | null;
  error: ResponseErrorDataI | undefined;
}

export const $promotionsStats = createStore<PromotionsStatsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchPromotionsStatsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchPromotionsStatsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetPromotionsStatsEvent);


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


interface ProductUnitsItemsStoreI extends LoadingI {
  data: ProductUnitI[];
  productId: number | null;
}

export const $productUnitsItems = createStore<ProductUnitsItemsStoreI>({ loading: false, productId: null, data: [], error: undefined })
  .on(effects.fetchProductUnitsItemsEffect, (state, params) => ({
    ...state,
    loading: true,
    productId: params.productId
  }))
  .on(effects.fetchProductUnitsItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetProductUnitsItems);


export const $createPromotion = createStore({ loading: false, success: false, error: undefined })
  .on(effects.createPromotionEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createPromotionEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetCreatePromotionEvent);

export const $updatePromotion = createStore({ loading: false, success: false, error: undefined })
  .on(effects.updatePromotionEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updatePromotionEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetUpdatePromotionEvent);

interface ChangePromotionStatusStoreI {
  loading: string | null;
  success: string | null;
  error: ResponseErrorDataI | undefined;
}

export const $changePromotionStatus = createStore<ChangePromotionStatusStoreI>({ loading: null, success: null, error: undefined })
  .on(effects.changePromotionStatusEffect, (prevStore, params) => {
    return {
      ...prevStore,
      loading: params.status,
    };
  })
  .on(effects.changePromotionStatusEffect.done, (prevStore, result) => {
    return {
      ...prevStore,
      success: result.params.status,
      loading: null,
      error: undefined
    };
  })
  .reset(events.resetChangePromotionStatusEvent);

interface PromotionDetailsStoreI {
  loading: boolean;
  data: PromotionDetailsI | null;
  error: ResponseErrorDataI | undefined;
}

export const $promotionDetails = createStore<PromotionDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchPromotionDetailsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchPromotionDetailsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetPromotionDetailsEvent);