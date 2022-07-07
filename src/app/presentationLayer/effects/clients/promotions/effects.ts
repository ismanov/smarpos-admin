import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import {
  FetchProductUnitsType,
  ProductUnitI,
  SearchProductI,
  SearchProductsType
} from "app/businessLogicLayer/models/Product";
import {
  CreatePromotionI,
  UpdatePromotionI,
  FetchPromotionsListParamsType, PromotionDetailsI,
  PromotionListItemI, PromotionStats, ChangePromotionStatusI
} from "app/businessLogicLayer/models/Promotions";

let cancelToken: CancelTokenSource = axios.CancelToken.source();


export const fetchPromotionsListEffect = createEffect<FetchPromotionsListParamsType, PaginationResponse<PromotionListItemI>, Error>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchPromotionsList(params, cancelToken.token);
});

export const fetchPromotionsStatsEffect = createEffect<FetchPromotionsListParamsType, PromotionStats, Error>({
  handler: Repository.client.fetchPromotionsStats
});

export const searchProductsEffect = createEffect<SearchProductsType, SearchProductI[], Error>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск Товара отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.product.searchProductsInBranch(params, cancelToken.token);
});

export const fetchProductUnitsItemsEffect = createEffect<FetchProductUnitsType, ProductUnitI[], AxiosError>().use(async params => {
  return await Repository.product.fetchProductUnits(params)
});

export const createPromotionEffect = createEffect<CreatePromotionI, any, any>({
  handler: Repository.client.createPromotion
});

export const updatePromotionEffect = createEffect<UpdatePromotionI, any, any>({
  handler: Repository.client.updatePromotion
});

export const changePromotionStatusEffect = createEffect<ChangePromotionStatusI, any, any>({
  handler: Repository.client.changePromotionStatus
});

export const fetchPromotionDetailsEffect = createEffect<number, PromotionDetailsI, Error>({
  handler: Repository.client.fetchPromotionDetails
});