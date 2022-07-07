import { PagingFilter } from "app/businessLogicLayer/models/PagingFilter";
import { User } from "app/businessLogicLayer/models/User";
import instance from "app/businessLogicLayer/config/api";
import { Branch } from "app/businessLogicLayer/models/Branch";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Client, FetchClientsListParamsType } from "app/businessLogicLayer/models/Client";
import { CancelTokenSource } from "axios";

interface OwnerRepo {
  fetchOwners(
    filter?: PagingFilter & { activityTypeId?: number },
    cancelToken?: CancelTokenSource
  ): Promise<PaginationResponse<Client>>;
  fetchBranchForOwnerId(companyId: number): Promise<Array<Branch>>;
  fetchCustomerForBranchId(
    filter: PagingFilter & { branchId?: number, companyId?: number }
  ): Promise<PaginationResponse<User>>;
}

export default class OwnerRepoImpl implements OwnerRepo {
  fetchOwners(params?: FetchClientsListParamsType, cancelToken?: CancelTokenSource): Promise<PaginationResponse<Client>> {
    return instance.httpGet<PaginationResponse<Client>>(
      "/api/admin/company", params, { cancelToken: cancelToken ? cancelToken.token : undefined }
    );
  }

  fetchBranchForOwnerId(companyId: number): Promise<Array<Branch>> {
    return instance.httpGet<Array<Branch>>(
      `/api/admin/branches?companyId=${companyId}`
    );
  }

  fetchCustomerForBranchId(
    filter: PagingFilter & { branchId?: number, companyId?: number }
  ): Promise<PaginationResponse<User>> {
    return instance.httpGet<PaginationResponse<User>>(
      `/api/admin/users${instance.makeQueryParams(filter)}`
    );
  }
}
