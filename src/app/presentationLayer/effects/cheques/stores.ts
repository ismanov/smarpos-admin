import { createStore } from "effector";
import moment from "moment";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import {
  Cheque,
  ChequeByBranchI,
  ChequeByCompaniesI, ChequesByBranchListFilterI,
  ChequesByBranchStats,
  ChequesByCompaniesStats, ChequesListFilterI, ChequesStatsI, CompanyStatisticsByMonthI
} from "app/businessLogicLayer/models/Cheque";
import { Region } from "app/businessLogicLayer/models/Region";
import { ActivityType } from "app/businessLogicLayer/models/AcitivityType";
import { Client } from "app/businessLogicLayer/models/Client";
import { City } from "app/businessLogicLayer/models/City";
import { BranchItem } from "app/businessLogicLayer/models/Branch";
import { User } from "app/businessLogicLayer/models/User";
import { LoadingI } from "app/businessLogicLayer/models";

interface RegionsItemsType extends LoadingI {
  data: Region[];
}

export const $regionsItems = createStore<RegionsItemsType>({ loading: false, data: [], error: undefined })
  .on(effects.fetchRegionsItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchRegionsItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

interface CitiesItemsStoreI extends LoadingI {
  data: City[];
}

export const $citiesItems = createStore<CitiesItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchCitiesItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchCitiesItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetCitiesItemsEvent)

interface ActivityTypesItemsStoreI extends LoadingI {
  data: ActivityType[];
}

export const $activityTypesItems = createStore<ActivityTypesItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchActivityTypesItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchActivityTypesItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

interface CompanyItemsStoreI extends LoadingI {
  data: PaginationResponse<Client>;
}

export const $companyItems = createStore<CompanyItemsStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.searchCompanyItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.searchCompanyItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetCompanyItemsEvent);

interface BranchItemsStoreI extends LoadingI {
  data: BranchItem[];
}

export const $branchItems = createStore<BranchItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchBranchItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchBranchItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetBranchItemsEvent);

interface UsersItemsStoreI extends LoadingI {
  data: PaginationResponse<User>;
}

export const $usersItems = createStore<UsersItemsStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchUsersItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchUsersItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetUsersItemsEvent);

// Cheques

interface ChequesListStoreI extends LoadingI {
  data: PaginationResponse<Cheque>;
}

export const $chequesList = createStore<ChequesListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchChequesListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequesListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchChequesListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));

export const $chequesListFilter = createStore<ChequesListFilterI>({
  from: moment().startOf("month").format("YYYY-MM-DD HH:mm"),
  to: moment().endOf("day").format("YYYY-MM-DD HH:mm"),
  es: true
})
  .on(events.updateChequesListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetChequesListFilter);

export const $chequesListSort = createStore<ChequesListFilterI>({})
  .on(events.updateChequesListSort, (prevStore, props) => ({ ...prevStore, ...props }));


interface ChequesStatsStoreI extends LoadingI {
  data: ChequesStatsI | null;
}

export const $chequesStats = createStore<ChequesStatsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchChequesStatsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequesStatsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));


interface ChequeDetailsStoreI extends LoadingI {
  data: Cheque | null;
}

export const $chequeDetails = createStore<ChequeDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchChequeDetailsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequeDetailsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetChequeDetailsEvent);

// Cheques By Branches

interface ChequesByBranchListStoreI extends LoadingI {
  data: PaginationResponse<ChequeByBranchI>;
}

export const $chequesByBranchList = createStore<ChequesByBranchListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchChequesByBranchListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequesByBranchListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .on(effects.fetchChequesByBranchListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $chequesByBranchListFilter = createStore<ChequesByBranchListFilterI>({
  from: moment().startOf("month").format("YYYY-MM-DD"),
  to: moment().endOf("day").format("YYYY-MM-DD"),
  es: true
})
  .on(events.updateChequesByBranchListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetChequesByBranchListFilter);

export const $chequesByBranchListSort = createStore<ChequesByBranchListFilterI>({})
  .on(events.updateChequesByBranchListSort, (prevStore, props) => ({ ...prevStore, ...props }));


interface ChequesByBranchStatsStoreI extends LoadingI {
  data: ChequesByBranchStats | null;
}

export const $chequesByBranchStats = createStore<ChequesByBranchStatsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchChequesByBranchStatsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequesByBranchStatsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

// Cheques By Companies

interface ChequesByCompaniesListStoreI extends LoadingI {
  data: PaginationResponse<ChequeByCompaniesI>;
}

export const $chequesByCompaniesList = createStore<ChequesByCompaniesListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchChequesByCompaniesListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequesByCompaniesListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .on(effects.fetchChequesByCompaniesListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }));


export const $chequesByCompaniesListFilter = createStore<ChequesByBranchListFilterI>({
  from: moment().startOf("month").format("YYYY-MM-DD"),
  to: moment().endOf("day").format("YYYY-MM-DD"),
  es: true,
})
  .on(events.updateChequesByCompaniesListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetChequesByCompaniesListFilter);

export const $chequesByCompaniesListSort = createStore<ChequesByBranchListFilterI>({})
  .on(events.updateChequesByCompaniesListSort, (prevStore, props) => ({ ...prevStore, ...props }));

interface ChequesByCompaniesStatsStoreI extends LoadingI {
  data: ChequesByCompaniesStats | null;
}

export const $chequesByCompaniesStats = createStore<ChequesByCompaniesStatsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchChequesByCompaniesStatsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequesByCompaniesStatsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

interface CompanyStatisticsByMonthStoreI extends LoadingI {
  data: CompanyStatisticsByMonthI[];
}

export const $companyStatisticsByMonth = createStore<CompanyStatisticsByMonthStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchCompanyStatisticsByMonthEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchCompanyStatisticsByMonthEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .on(effects.fetchCompanyStatisticsByMonthEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetCompanyStatisticsByMonthEvent);

interface BranchesStatisticsStoreI extends LoadingI {
  data: CompanyStatisticsByMonthI[];
}

export const $branchesStatistics = createStore<BranchesStatisticsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchBranchesStatisticsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchBranchesStatisticsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .on(effects.fetchBranchesStatisticsEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetBranchesStatisticsEvent);

  export const $paymentTypes = createStore<Array<string>>([])
    .on(effects.fetchPaymentTypesEffect.done, (state, result) => [...state, ...result.result])