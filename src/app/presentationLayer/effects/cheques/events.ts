import { createEvent } from "effector";
import { ChequesByBranchListFilterI, ChequesListFilterI } from "app/businessLogicLayer/models/Cheque";

export const updateChequesListFilter = createEvent<ChequesListFilterI>();
export const resetChequesListFilter = createEvent();

export const updateChequesListSort = createEvent<ChequesListFilterI>();

export const updateChequesByBranchListFilter = createEvent<ChequesByBranchListFilterI>();
export const resetChequesByBranchListFilter = createEvent();

export const updateChequesByBranchListSort = createEvent<ChequesByBranchListFilterI>();

export const updateChequesByCompaniesListFilter = createEvent<ChequesByBranchListFilterI>();
export const resetChequesByCompaniesListFilter = createEvent();

export const updateChequesByCompaniesListSort = createEvent<ChequesByBranchListFilterI>();

export const resetChequeDetailsEvent = createEvent();
export const resetCompanyStatisticsByMonthEvent = createEvent();
export const resetBranchesStatisticsEvent = createEvent();

export const resetCitiesItemsEvent = createEvent();
export const resetCompanyItemsEvent = createEvent();
export const resetBranchItemsEvent = createEvent();
export const resetUsersItemsEvent = createEvent();