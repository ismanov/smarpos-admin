import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import {
  CreateTelegramAccountI,
  UpdateTelegramAccountI,
  FetchTelegramAccountsListParamsI,
  TelegramAccountListItemI,
  TelegramAccountDetailsI,
  FetchAvailableTelegramAgreementsParamsI, EnableTelegramAccountParamsI,
} from "app/businessLogicLayer/models/TelegramAccount";

let cancelToken: CancelTokenSource = axios.CancelToken.source();

export const fetchTelegramAccountsList = createEffect<FetchTelegramAccountsListParamsI, TelegramAccountListItemI[], AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.telegramAccount.fetchTelegramAccountsList(params, cancelToken.token);
});

export const createTelegramAccount = createEffect<CreateTelegramAccountI, any, AxiosError>({
  handler: Repository.telegramAccount.createTelegramAccount
});

export const updateTelegramAccount = createEffect<UpdateTelegramAccountI, any, AxiosError>({
  handler: Repository.telegramAccount.updateTelegramAccount
});

export const deleteTelegramAccount = createEffect<number, any, AxiosError>({
  handler: Repository.telegramAccount.deleteTelegramAccount
});

export const fetchTelegramAccountDetails = createEffect<number, TelegramAccountDetailsI, AxiosError>({
  handler: Repository.telegramAccount.fetchTelegramAccountDetails
});

export const fetchAvailableTelegramAgreements = createEffect<FetchAvailableTelegramAgreementsParamsI, any[], AxiosError>({
  handler: Repository.telegramAccount.fetchAvailableTelegramAgreements
});

export const enableTelegramAccount = createEffect<EnableTelegramAccountParamsI, any, AxiosError>({
  handler: Repository.telegramAccount.enableTelegramAccount
});

export const disableTelegramAccount = createEffect<number, any, AxiosError>({
  handler: Repository.telegramAccount.disableTelegramAccount
});