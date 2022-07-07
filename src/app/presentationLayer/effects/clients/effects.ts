import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Client, FetchClientsListParamsType, FetchClientStatParamsI, ClientStatI } from "app/businessLogicLayer/models/Client";
import { ActivityType } from "app/businessLogicLayer/models/AcitivityType";
import { BusinessType } from "app/businessLogicLayer/models/BusinessType";
import {
  BranchItem,
  FetchBranchItemsType
} from "app/businessLogicLayer/models/Branch";
import { User } from "app/businessLogicLayer/models/User";
import { Contractor } from "app/businessLogicLayer/models/Contractor";
import { FetchProductUnitsType, ProductUnitI } from "app/businessLogicLayer/models/Product";
import { CategoryItem, FetchCategoryItemsI } from "app/businessLogicLayer/models/Category";
import { Vat } from "app/businessLogicLayer/models/Vat";

let cancelToken: CancelTokenSource = axios.CancelToken.source();


export const fetchActivityTypesItemsEffect = createEffect<void, Array<ActivityType>, AxiosError>().use(async params => {
  return await Repository.resources.fetchActivityTypes()
});

export const sendSmsEffect = createEffect<any, any, AxiosError>().use(async data => {
  return await Repository.resources.sendSms(data)
});

export const fetchBusinessTypesItemsEffect = createEffect<void, Array<BusinessType>, AxiosError>().use(async params => {
  return await Repository.resources.fetchBusinessTypes()
});

export const fetchVatsItemsEffect = createEffect<void, Vat[], AxiosError>({
  handler: Repository.vat.fetchVats
});

export const fetchBranchItems = createEffect<FetchBranchItemsType, Array<BranchItem>, AxiosError>().use(async params => {
  return await Repository.branch.fetchBranchItems(params)
});

export const fetchUserItemsEffect = createEffect<{branchId?: number, companyId?: number}, PaginationResponse<User>, AxiosError>().use(async params => {
  return await Repository.owner.fetchCustomerForBranchId({page: 0, size: 100000, branchId: params.branchId, companyId: params.companyId})
});

export const fetchContractorsItemsEffect = createEffect<any, PaginationResponse<Contractor>, AxiosError>().use(async params => {
  return await Repository.client.fetchContractors(params)
});

export const fetchProductUnitsItemsEffect = createEffect<FetchProductUnitsType, ProductUnitI[], AxiosError>().use(async params => {
  return await Repository.product.fetchProductUnits(params)
});

export const fetchCategoryItems = createEffect<FetchCategoryItemsI, CategoryItem[], AxiosError>().use(async params => {
  return await Repository.client.fetchCategoryItems(params)
});

// Clients components

export const fetchClientsListEffect = createEffect<FetchClientsListParamsType, PaginationResponse<Client>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchClientsList(params, cancelToken.token);
});

export const fetchClientsListForContentManagerEffect = createEffect<FetchClientsListParamsType, PaginationResponse<Client>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.client.fetchClientsListContentManager(params, cancelToken.token);
});

export const fetchClientDetails = createEffect<number, Client, AxiosError>({
  handler:  Repository.client.fetchClientById
});
export const sendConfirmSmsEffect = createEffect<any, {
  companyId: number;
  phoneNumber: string
}, AxiosError>({
  handler:  Repository.client.sendConfirmSms
});
export const ConfirmResEffect = createEffect<any, {
  permissionId: number;
  code: string
}, AxiosError>({
  handler:  Repository.client.sendConfirmRes
});

export const updateClientDetailsEffect = createEffect<any, any, AxiosError>({
  handler:  Repository.client.updateClient
});

export const fetchClientStatEffect = createEffect<FetchClientStatParamsI, ClientStatI, AxiosError>({
  handler:  Repository.client.fetchClientStat
});

export const postAccessKey = createEffect<string, void, AxiosError>({
  handler: Repository.client.postAccessKeyToCompany
});

export const sendAccessKey = createEffect<{inn: string, key: string, filter: FetchClientsListParamsType}, void, AxiosError>({
  handler: Repository.client.sendAccesskey
});