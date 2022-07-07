import instance from "app/businessLogicLayer/config/api";
import { CancelToken } from "axios";
import { CreateUserModel, FetchUsersListParamsType, User } from "app/businessLogicLayer/models/User";
import { PagingFilter } from "app/businessLogicLayer/models/PagingFilter";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";

interface UsersRepo {
  fetchUsers(
    filter: PagingFilter & {
      companyId?: number;
      branchId?: number;
      from?: string;
      to?: string;
      orderBy?: string;
    }
  ): Promise<PaginationResponse<User>>;
  // fetchLogs(): Promise<String>
}

export default class UsersRepoImpl implements UsersRepo {
  fetchUsers(params: FetchUsersListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<User>> {
    return instance.httpGet<PaginationResponse<User>>("/api/admin/users", params, {cancelToken});
  }
  fetchCompanyUsers(params: FetchUsersListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<User>> {
    return instance.httpGet<PaginationResponse<User>>("/api/admin/company/users", params, {cancelToken});
  }
  fetchAuthorities(): any {
    return instance.httpGet("/api/users/roles");
  }
  createCompanyUser(data: any): Promise<any> {
    return instance.httpPost<any>("/api/admin/company/users", data);
  }
  fetchBranches(params: any, cancelToken?: any): Promise<any> {
    return  instance.httpGet<PaginationResponse<any>>("/api/admin/branches/search", params, { cancelToken })
  }

  createUser(data: CreateUserModel): Promise<any> {
    return instance.httpPost<any>("/api/admin/users", data);
  }

  updateUser(data: CreateUserModel): Promise<any> {
    return instance.httpPut<any>("/api/admin/users", data);
  }

  getUser(userId: number): Promise<User> {
    return instance.httpGet<any>(`/api/users/${userId}`);
  }

  // updateUser(user: User): Promise<void> {
  //   return instance.httpPut(`/api/users`, user)
  // }

  updateLogin(user: User): Promise<void> {
    return instance.httpPut(`/api/admin/users/login`, user)
  }

  expireToken(id: number): Promise<void> {
      return instance.httpPut(`/api/admin/user/token/${id}`, {})
  }

  fetchTgUsers(params: FetchUsersListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<User>> {
    return instance.httpGet<PaginationResponse<User>>("/api/admin/telegram-users", params, {cancelToken});
  }
}
