import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchUsersListParamsType, User } from "app/businessLogicLayer/models/User";

let cancelToken: CancelTokenSource = axios.CancelToken.source();


export const fetchStaffListEffect = createEffect<FetchUsersListParamsType, PaginationResponse<User>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.user.fetchUsersStaff(params, cancelToken.token);
});

export const updateUserEffect = createEffect<User, any, AxiosError>({
  handler:  Repository.user.updateUser
});

export const updateUserLoginEffect = createEffect<User, any, AxiosError>({
  handler:  Repository.user.updateLogin
});

export const expireTokenEffect = createEffect<number, any, AxiosError>({
  handler:  Repository.user.expireToken
});