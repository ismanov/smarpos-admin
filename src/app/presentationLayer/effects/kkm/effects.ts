import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchKkmsListParamsType, KKM } from "app/businessLogicLayer/models/KKM";

let cancelToken: CancelTokenSource = axios.CancelToken.source();


export const fetchKkmListEffect = createEffect<FetchKkmsListParamsType, PaginationResponse<KKM>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.kkm.fetchKKMList(params, cancelToken.token);
});

export const syncKkmEffect = createEffect<number, any, AxiosError>({
  handler:  Repository.kkm.syncKKM
});

export const deleteKkmEffect = createEffect<number, any, AxiosError>({
  handler:  Repository.kkm.deleteKKM
});