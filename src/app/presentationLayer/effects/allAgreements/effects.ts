import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import {
  FetchAgreementsListParamsI,
  AgreementListItemI, UploadQuoteFileI, LastActiveQuoteI, AcceptPublicOfferI, ChangeQuoteStatusParamsI,
} from "app/businessLogicLayer/models/Agreement";
import { FetchBranchesCountByCtoIdType } from "app/businessLogicLayer/models/Branch";

let agreementsListCancelToken: CancelTokenSource | null = null;

export const fetchCustomerBalance = createEffect<string, number, AxiosError>({
  handler: Repository.service.fetchCustomerBalance
});

export const fetchBranchesCount = createEffect<FetchBranchesCountByCtoIdType, number, AxiosError>({
  handler: Repository.branch.fetchBranchesCountByCtoId
});

export const fetchAgreementStatuses = createEffect<object, any[], AxiosError>({
  handler: Repository.service.fetchAgreementStatuses
});

export const fetchServicesTypes = createEffect<object, any[], AxiosError>({
  handler: Repository.service.fetchServicesTypes
});

export const fetchTariffsItems = createEffect<string, any[], AxiosError>({
  handler: Repository.service.fetchTariffsItems
});

export const fetchCustomerPublicOffer = createEffect<string, any, AxiosError>({
  handler: Repository.service.fetchCustomerPublicOffer
});

export const fetchLastPublicOffer = createEffect<object, LastActiveQuoteI, AxiosError>({
  handler: Repository.service.fetchLastPublicOffer
});

export const acceptPublicOffer = createEffect<AcceptPublicOfferI, LastActiveQuoteI, AxiosError>({
  handler: Repository.service.acceptPublicOffer
});

export const fetchAgreementsList = createEffect<FetchAgreementsListParamsI, AgreementListItemI[], AxiosError>().use(async params => {
  agreementsListCancelToken && agreementsListCancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  agreementsListCancelToken = axios.CancelToken.source();
  return await Repository.service.fetchAllAgreementsList(params, agreementsListCancelToken.token);
});

// export const fetchAgreementsStats = createEffect<FetchAgreementsListParamsI, AgreementsStatsI, AxiosError>({
//   handler: Repository.service.fetchAgreementsStats
// });

export const activateAgreement = createEffect<number, any, AxiosError>({
  handler: Repository.service.activateAgreement
});

export const pauseAgreement = createEffect<number, any, AxiosError>({
  handler: Repository.service.pauseAgreement
});

export const cancelAgreement = createEffect<number, any, AxiosError>({
  handler: Repository.service.cancelAgreement
});

export const createSubscriptionAgreement = createEffect<any, any, AxiosError>({
  handler: Repository.service.createSubscriptionAgreement
});

export const createCustomAgreement = createEffect<any, any, AxiosError>({
  handler: Repository.service.createCustomAgreement
});
export const updateSubAgreement = createEffect<any, any, AxiosError>({
  handler: Repository.service.updateSubAgreement
});



export const fetchAgreementDetails = createEffect<number, any, AxiosError>({
  handler: Repository.service.fetchAgreementDetails
});

export const updateCustomAgreementServiceDesc = createEffect<any, any, AxiosError>({
  handler: Repository.service.updateCustomAgreementServiceDesc
});

export const uploadCustomAgreementFile = createEffect<any, any, AxiosError>({
  handler: Repository.service.uploadCustomAgreementFile
});

export const fetchQuoteDetails = createEffect<number, any, AxiosError>({
  handler: Repository.service.fetchQuoteDetails
});

export const changeQuoteStatus = createEffect<ChangeQuoteStatusParamsI, any, AxiosError>({
  handler: Repository.service.changeQuoteStatus
});

export const fetchGeneratedQuote = createEffect<number, string, AxiosError>({
  handler: Repository.service.fetchGeneratedQuote
});

export const uploadQuoteFile = createEffect<UploadQuoteFileI, any, AxiosError>({
  handler: Repository.service.uploadQuoteFile
});

export const fetchAgreementInvoices = createEffect<any, any, AxiosError>({
  handler: Repository.service.fetchAgreementInvoices
});
export const updateStatusDataEntry = createEffect<any, any, AxiosError>({
  handler: Repository.service.updateDataEntryStatus
});

export const fetchGeneratedInvoice = createEffect<number, string, AxiosError>({
  handler: Repository.service.fetchGeneratedInvoice
});
export const fetchDataEntryByAgreementId = createEffect<any, any, AxiosError>({
  handler: Repository.service.fetchDataEntryByAgreementId
});