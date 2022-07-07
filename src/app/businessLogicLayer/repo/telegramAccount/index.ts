import instance from "app/businessLogicLayer/config/api";
import { CancelToken } from "axios";
import {
  CreateTelegramAccountI, EnableTelegramAccountParamsI, FetchAvailableTelegramAgreementsParamsI,
  FetchTelegramAccountsListParamsI, TelegramAccountDetailsI,
  TelegramAccountListItemI, UpdateTelegramAccountI
} from "app/businessLogicLayer/models/TelegramAccount";

export default class TelegramAccountRepoImpl {
  fetchTelegramAccountsList(params: FetchTelegramAccountsListParamsI, cancelToken?: CancelToken): Promise<TelegramAccountListItemI[]> {
    return instance.httpGet<TelegramAccountListItemI[]>(`/api/companies/${params.companyId}/telegram-accounts`, {}, { cancelToken });
  }

  createTelegramAccount(data: CreateTelegramAccountI): Promise<any> {
    return instance.httpPost<any>("/api/telegram-accounts", data);
  }

  updateTelegramAccount({ id, ...data }: UpdateTelegramAccountI): Promise<any> {
    return instance.httpPut<any>(`/api/telegram-accounts/${id}`, data);
  }

  deleteTelegramAccount(id: number): Promise<any> {
    return instance.httpDelete<any>(`/api/telegram-accounts/${id}`);
  }

  fetchTelegramAccountDetails(id: number): Promise<TelegramAccountDetailsI> {
    return instance.httpGet<TelegramAccountDetailsI>(`/api/telegram-accounts/${id}`);
  }

  fetchAvailableTelegramAgreements(params: FetchAvailableTelegramAgreementsParamsI): Promise<any[]> {
    return instance.httpPut<any[]>(`/api/telegram-accounts/available_agreements/${instance.makeQueryParams(params)}`);
  }

  enableTelegramAccount(payload: EnableTelegramAccountParamsI): Promise<any> {
    return instance.httpPut<any>(`/api/telegram-accounts/${payload.id}/enable/${instance.makeQueryParams(payload.data)}`);
  }

  disableTelegramAccount(id: number): Promise<any> {
    return instance.httpPut<any>(`/api/telegram-accounts/${id}/disable`);
  }
}