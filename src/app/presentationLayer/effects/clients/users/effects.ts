import { createEffect } from "effector";
import { AxiosError } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchUsersListParamsType, User } from "app/businessLogicLayer/models/User";
export type roleType = {
  code: string
  nameRu: string
  priority: number
  roleCode: string
}

export const fetchUsersListEffect = createEffect<FetchUsersListParamsType, PaginationResponse<User>, AxiosError>().use(async(params) => {
  return await Repository.user[!!params.companyId ?'fetchCompanyUsers':'fetchUsers'](params) 
});
export const fetchAuthoritiesListEffects = createEffect<undefined, Array<roleType>, AxiosError>().use(async () => {
  return await Repository.user.fetchAuthorities()
});

export const fetchBranchesListEffect = createEffect<any, any, any>().use(async params => {
  return await Repository.user.fetchBranches(params);
});

export const createCompanyUser = createEffect<any, any, AxiosError>({
  handler: Repository.user.createCompanyUser
});