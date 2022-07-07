import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import {
  Cheque,
  ChequesByBranchStats,
  ChequeStatusI,
  FetchChequesListParamsI
} from "app/businessLogicLayer/models/Cheque";

let cancelToken: CancelTokenSource = axios.CancelToken.source();

export const fetchChequesStatuses = createEffect<object, ChequeStatusI[], AxiosError>({
  handler: Repository.cheque.fetchChequesStatuses
});

export const fetchChequesListEffect = createEffect<FetchChequesListParamsI, PaginationResponse<Cheque>, Error>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск Чека отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.cheque.fetchChequeList(params, cancelToken.token);
});

export const fetchChequesStatsEffect = createEffect<FetchChequesListParamsI, ChequesByBranchStats, Error>({
  handler: Repository.cheque.fetchChequesByBranchStats
});

export const fetchChequeDetailsEffect = createEffect<number, Cheque, Error>({
  handler: Repository.cheque.fetchChequeById
});