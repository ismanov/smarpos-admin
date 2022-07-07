import { createEffect } from "effector";
import { FetchCatalogParamsType, FetchCatalogProductsParamsType } from "app/businessLogicLayer/models/Client";
import Repository from "app/businessLogicLayer/repo";
import { UnitItem } from "app/businessLogicLayer/models/Unit";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import axios, { CancelTokenSource } from "axios";
import { Vat } from "app/businessLogicLayer/models/Vat";

let cancelToken: CancelTokenSource = axios.CancelToken.source();


export const syncCatalogEffect = createEffect<any, any, Error>({
  handler: Repository.client.syncCatalog
});

export const fetchCatalogEffect = createEffect<FetchCatalogParamsType, any, Error>({
  handler: Repository.client.fetchCatalog
});

export const createCategoryEffect = createEffect<any, any, Error>({
  handler: Repository.client.createCategory
});

export const deleteCategoryEffect = createEffect<any, any, Error>({
  handler: Repository.client.deleteCategory
});

export const fetchUnitsItemsEffect = createEffect<Object, UnitItem[], Error>({
  handler: Repository.units.fetchUnitsItems
});

export const fetchVatsItemsEffect = createEffect<Object, Vat[], Error>({
  handler: Repository.vat.fetchVats
});

export const fetchCatalogProductsEffect = createEffect<FetchCatalogProductsParamsType, PaginationResponse<any>, Error>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchCatalogProducts(params, cancelToken.token);
});

export const fetchCurrentProductEffect = createEffect<any, any, Error>({
  handler: Repository.client.fetchCurrentProduct
});

export const createCatalogProductEffect = createEffect<any, any, any>({
  handler: Repository.client.createCatalogProduct
});

export const updateCatalogProductEffect = createEffect<any, any, any>({
  handler: Repository.client.updateCatalogProduct
});

export const deleteCatalogProductEffect = createEffect<any, any, any>({
  handler: Repository.client.deleteCatalogProduct
});