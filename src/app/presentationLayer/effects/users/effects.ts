import { createEffect } from "effector";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { CreateUserModel, FetchUsersListParamsType, User } from "app/businessLogicLayer/models/User";

let cancelToken: CancelTokenSource = axios.CancelToken.source();

export const fetchUsersListEffect = createEffect<FetchUsersListParamsType, PaginationResponse<User>, AxiosError>().use(async params => {
  cancelToken && cancelToken.cancel('Поиск отменен! Отправляется новый запрос!');
  cancelToken = axios.CancelToken.source();
  return await Repository.user.fetchUsers(params, cancelToken.token);
});

export const fetchUserDetailsEffect = createEffect<number, User, AxiosError>({
  handler: Repository.user.getUser
});

export const createUserEffect = createEffect<CreateUserModel, any, AxiosError>({
  handler: Repository.user.createUser
});

export const updateUserEffect = createEffect<CreateUserModel, any, AxiosError>({
  handler: Repository.user.updateUser
});