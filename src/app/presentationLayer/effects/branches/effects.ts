import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Branch, FetchBranchesListParamsType, MapBranchI } from "app/businessLogicLayer/models/Branch";

let cancelToken: CancelTokenSource = axios.CancelToken.source();


export const fetchBranchesListEffect = createEffect<FetchBranchesListParamsType, PaginationResponse<Branch>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.branch.fetchBranches(params, cancelToken.token);
});

export const fetchBranchesListMapEffect = createEffect<FetchBranchesListParamsType, MapBranchI[], AxiosError>({
  handler:  Repository.branch.fetchBranchesList
});