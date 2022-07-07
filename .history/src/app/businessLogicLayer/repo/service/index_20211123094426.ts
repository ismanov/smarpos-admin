import instance from "app/businessLogicLayer/config/api";
import { CancelToken } from "axios";
import {
  FetchAgreementsListParamsI,
  AgreementListItemI, UploadQuoteFileI, LastActiveQuoteI, AcceptPublicOfferI, ChangeQuoteStatusParamsI
} from "app/businessLogicLayer/models/Agreement";

export default class ServiceRepoImpl {
  fetchCustomerBalance(tin: string): Promise<any> {
    return instance.httpGet<any>(`/api/admin/billing-services/balance/tin/${tin}`)
  }

  fetchAgreementStatuses(): Promise<any[]> {
    return instance.httpGet<any[]>("/api/billing-services/xizmats");
  }

  fetchServicesTypes(): Promise<any[]> {
    return instance.httpGet<any[]>("/api/billing-services/xizmats");
  }

  fetchTariffsItems(params:string = ''): Promise<any[]> {
    return instance.httpGet<any[]>("/api/billing-services/xizmats"+params);
  }

  fetchCustomerPublicOffer(tin: string): Promise<any> {
    return instance.httpGet<any>(`/api/admin/billing-services/customer-public-offer/tin/${tin}`);
  }

  fetchLastPublicOffer(): Promise<LastActiveQuoteI> {
    return instance.httpGet<LastActiveQuoteI>("/api/admin/billing-services/get-last-active-offer");
  }

  acceptPublicOffer(data: AcceptPublicOfferI): Promise<LastActiveQuoteI> {
    return instance.httpPost<any>("/api/admin/billing-services/customer-public-offer/create-by-tin", data);
  }

  fetchAgreementsList({ tin, ...restParams }: FetchAgreementsListParamsI, cancelToken?: CancelToken): Promise<AgreementListItemI[]> {
    return instance.httpGet<AgreementListItemI[]>(`/api/admin/billing-services/agreements-by-tin/${tin}`, restParams, { cancelToken })
  }
 
  fetchAllAgreementsList({ tin, ...restParams }: FetchAgreementsListParamsI, cancelToken?: CancelToken): Promise<AgreementListItemI[]> {
    return instance.httpGet<AgreementListItemI[]>(`/api/billing-services/agreements`, restParams, { cancelToken })
  }

  activateAgreement(id: number): Promise<any> {
    return instance.httpPut<any>(`/api/billing-services/agreements/${id}/activate`);
  }

  pauseAgreement(id: number): Promise<any> {
    return instance.httpPut<any>(`/api/billing-services/agreements/${id}/pause`);
  }

  cancelAgreement(id: number): Promise<any> {
    return instance.httpPut<any>(`/api/billing-services/agreements/${id}/cancel`);
  }

  // fetchAgreementsStats(params: FetchAgreementsListParamsI): Promise<AgreementsStatsI> {
  //   return instance.httpGet<AgreementsStatsI>("/api/admin/promotions/stats", params)
  // }

  createSubscriptionAgreement(data: any): Promise<any> {
    return instance.httpPost<any>("/api/admin/billing-services/agreements", data);
  }

  createCustomAgreement(data: any): Promise<any> {
    if(data.id) return instance.httpPost<any>(`/api/admin/billing-services/${data.id}/update-agreements`, data.data); 
    return instance.httpPost<any>("/api/admin/billing-services/multi-agreements", data);
  }

  updateSubAgreement( data: any): Promise<any> {
    return instance.httpPost<any>(`/api/admin/billing-services/${data.id}/update-agreements`, data.data);
  }

  updateCustomAgreementServiceDesc({ id, ...rest }: any): Promise<any> {
    return instance.httpPost<any>(`/api/admin/billing-services/agreements/${id}/update-note`, rest.note);
  }

  uploadCustomAgreementFile({ data }): Promise<any> {
    return instance.httpPost<any>("/api/admin/billing-services/attachment/add", data);
  }

  fetchAgreementDetails(id: number): Promise<any> {
    return instance.httpGet<any>(`/api/admin/billing-services/agreements/${id}`);
  }

  fetchQuoteDetails(quoteId: number): Promise<any> {
    return instance.httpGet<any>(`/api/quote/${quoteId}`);
  }

  changeQuoteStatus(data: ChangeQuoteStatusParamsI): Promise<any> {
    return instance.httpPut<any>(`/api/quote/${data.id}/change-status`, data);
  }

  fetchGeneratedQuote(quoteId: number): Promise<any> {
    return instance.httpGet<any>(`/api/quote/${quoteId}/template`);
  }

  uploadQuoteFile(data: UploadQuoteFileI): Promise<any> {
    return instance.httpPost<any>(`/api/quote/${data.id}/upload`, data.file);
  }

  fetchAgreementInvoices({ quoteId, params }: any): Promise<any> {
    return instance.httpGet<any>(`/api/billing-invoice/get-by-quote-id/${quoteId}`, params);
  }
  updateDataEntryStatus(data: {
    id: number;
  }): Promise<any> {
    return instance.httpPut<any>('/api/data-entry/approve', data);
  }

  fetchGeneratedInvoice(invoiceId: number): Promise<string> {
    return instance.httpGet<string>(`/api/billing-invoice/${invoiceId}/template`);
  }

  fetchDataEntryByAgreementId(invoiceId: number): Promise<string> {
    return instance.httpGet<any>(`/api/data-entry/${invoiceId}`);
  }
  ApproveDataEntryStatus(data: ChangeQuoteStatusParamsI): Promise<any> {
    return instance.httpPut<any>('/api/data-entry/approve', data);
  }
}