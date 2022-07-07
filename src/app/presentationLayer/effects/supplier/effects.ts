import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { SUPPLIER, FetchSupplierListParamsType, SupplierOrder, FetchSupplierDetailsOrdersListParamsType, SupplierCurrentOrder } from "app/businessLogicLayer/models/Supplier";

let cancelToken: CancelTokenSource = axios.CancelToken.source();

// SUPPLIERS-LIST

export const fetchSupplierListEffect = createEffect<FetchSupplierListParamsType, PaginationResponse<SUPPLIER>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.supplier.fetchSupplierList(params, cancelToken.token);
});

// SUPPLIERS-DETAILS

export const fetchSupplierDetailsEffect = createEffect<number, SUPPLIER, AxiosError>({
  handler: Repository.supplier.fetchSupplierDetails
});

export const fetchSupplierDetailsOrdersListEffect = createEffect<FetchSupplierDetailsOrdersListParamsType, PaginationResponse<SupplierOrder>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.supplier.fetchSupplierDetailsOrders(params, cancelToken.token);
});

// Current order
export const fetchSupplierDetailsCurrentOrderEffect = createEffect<number, SupplierCurrentOrder, AxiosError>({
  handler: Repository.supplier.fetchSupplierDetailsCurrentOrder
});