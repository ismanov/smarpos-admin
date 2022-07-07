import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchUsersListParamsType, User } from "app/businessLogicLayer/models/User";

let cancelToken: CancelTokenSource = axios.CancelToken.source();


export const fetchTgUsersListEffect = createEffect<FetchUsersListParamsType, PaginationResponse<User>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.user.fetchTgUsers(params, cancelToken.token);
});