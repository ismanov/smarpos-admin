import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import {
  CreateWarehouseIncomeI,
  CreateWarehouseOrderI,
  FetchWarehouseIncomesListParamsType,
  FetchWarehouseOrdersListParamsType, FetchWarehouseStatI,
  FetchWarehouseStockByDayListParamsType,
  FetchWarehouseStockListParamsType, WarehouseIncomeModel, WarehouseStatI, WarehouseStockByDayModel,
  WarehouseStockModel,
  WarehouseStockStatModel
} from "app/businessLogicLayer/models/Client";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Cheque } from "app/businessLogicLayer/models/Cheque";
import { SearchProductI, SearchProductsType } from "app/businessLogicLayer/models/Product";

let cancelToken: CancelTokenSource = axios.CancelToken.source();

export const fetchWarehouseStatEffect = createEffect<FetchWarehouseStatI, WarehouseStatI, AxiosError>({
  handler: Repository.client.fetchWarehouseStat
});

export const fetchWarehouseStockListEffect = createEffect<FetchWarehouseStockListParamsType, PaginationResponse<WarehouseStockModel>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchWarehouseStockList(params, cancelToken.token);
});

export const fetchWarehouseStockStatEffect = createEffect<FetchWarehouseStockListParamsType, WarehouseStockStatModel, AxiosError>({
  handler: Repository.client.fetchWarehouseStockStat
});

export const fetchWarehouseStockByDayListEffect = createEffect<FetchWarehouseStockByDayListParamsType, PaginationResponse<WarehouseStockByDayModel>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchWarehouseStockByDayList(params, cancelToken.token);
});

export const searchProductsEffect = createEffect<SearchProductsType, SearchProductI[], AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск Товара отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.product.searchProducts(params, cancelToken.token);
});

export const fetchWarehouseIncomesListEffect = createEffect<FetchWarehouseIncomesListParamsType, PaginationResponse<WarehouseIncomeModel>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchWarehouseIncomesList(params, cancelToken.token);
});

export const createWarehouseIncomeEffect = createEffect<CreateWarehouseIncomeI, any, AxiosError>({
  handler: Repository.client.createWarehouseIncome
});

export const fetchWarehouseOrdersListEffect = createEffect<FetchWarehouseOrdersListParamsType, PaginationResponse<Cheque>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск Чека отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchWarehouseOrdersList(params, cancelToken.token);
});

export const createWarehouseOrderEffect = createEffect<CreateWarehouseOrderI, any, AxiosError>({
  handler: Repository.client.createWarehouseOrder
});