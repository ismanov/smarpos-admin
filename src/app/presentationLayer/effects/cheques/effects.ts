import { createEffect } from "effector";
import axios, { CancelTokenSource, AxiosError } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import {
  Cheque,
  ChequeByBranchI, ChequeByCompaniesI,
  ChequesByBranchStats, ChequesByCompaniesStats, ChequesStatsI, CompanyStatisticsByMonthI,
  FetchChequesByBranchListParamsI, FetchChequesListParamsI, FetchCompanyStatisticsByMonthParamsI
} from "app/businessLogicLayer/models/Cheque";
import { Region } from "app/businessLogicLayer/models/Region";
import { ActivityType } from "app/businessLogicLayer/models/AcitivityType";
import { Client, FetchClientsListParamsType } from "app/businessLogicLayer/models/Client";
import { City } from "app/businessLogicLayer/models/City";
import { BranchItem, FetchBranchItemsType } from "app/businessLogicLayer/models/Branch";
import { FetchUsersItemsI, User } from "app/businessLogicLayer/models/User";

let cancelToken: CancelTokenSource = axios.CancelToken.source();

export const fetchRegionsItemsEffect = createEffect<void, Array<Region>, AxiosError>({
  handler: Repository.resources.fetchRegionList
});

export const fetchCitiesItemsEffect = createEffect<number, Array<City>, AxiosError>().use(async regionId => {
  return await Repository.resources.fetchCityListForRegionId(regionId);
});

export const fetchActivityTypesItemsEffect = createEffect<void, Array<ActivityType>, AxiosError>({
  handler: Repository.resources.fetchActivityTypes
});

export const searchCompanyItemsEffect = createEffect<FetchClientsListParamsType, PaginationResponse<Client>, AxiosError>({
  handler: Repository.owner.fetchOwners
});

export const fetchBranchItemsEffect = createEffect<FetchBranchItemsType, BranchItem[], AxiosError>({
  handler: Repository.branch.fetchBranchItems
});

export const fetchUsersItemsEffect = createEffect<FetchUsersItemsI, PaginationResponse<User>, AxiosError>({
  handler: Repository.owner.fetchCustomerForBranchId
});

export const fetchPaymentTypesEffect = createEffect<void, Array<string>, AxiosError>({
  handler: Repository.cheque.fetchPaymentTypes
})

// Cheques

export const fetchChequesListEffect = createEffect<FetchChequesListParamsI, PaginationResponse<Cheque>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск Чека отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.cheque.fetchChequeList(params)
});

export const fetchChequesStatsEffect = createEffect<FetchChequesListParamsI, ChequesStatsI, AxiosError>({
  handler: Repository.cheque.fetchChequesStats
});

export const fetchChequeDetailsEffect = createEffect<number, Cheque, AxiosError>({
  handler: Repository.cheque.fetchChequeById
});

// Cheques By Branches

export const fetchChequesByBranchListEffect = createEffect<FetchChequesByBranchListParamsI, PaginationResponse<ChequeByBranchI>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск Чека отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.cheque.fetchChequesByBranch(params)
});

export const fetchChequesByBranchStatsEffect = createEffect<FetchChequesByBranchListParamsI, ChequesByBranchStats, AxiosError>({
  handler: Repository.cheque.fetchChequesByBranchStats
});

// Cheques By Companies

export const fetchChequesByCompaniesListEffect = createEffect<FetchChequesByBranchListParamsI, PaginationResponse<ChequeByCompaniesI>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск Чека отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.cheque.fetchChequesByCompaniesList(params)
});

export const fetchChequesByCompaniesStatsEffect = createEffect<FetchChequesByBranchListParamsI, ChequesByCompaniesStats, AxiosError>({
  handler: Repository.cheque.fetchChequesByCompaniesStats
});

export const fetchCompanyStatisticsByMonthEffect = createEffect<FetchCompanyStatisticsByMonthParamsI, CompanyStatisticsByMonthI[], AxiosError>({
  handler: Repository.cheque.fetchCompanyChequesByMonth
});

export const fetchBranchesStatisticsEffect = createEffect<FetchCompanyStatisticsByMonthParamsI, CompanyStatisticsByMonthI[], AxiosError>({
  handler: Repository.cheque.fetchBranchesStatistics
});