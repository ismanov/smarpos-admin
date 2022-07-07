import instance from "app/businessLogicLayer/config/api";
import {
  Branch,
  BranchItem, FetchBranchesCountByCtoIdType,
  FetchBranchesListParamsType,
  FetchBranchItemsType, MapBranchI
} from "app/businessLogicLayer/models/Branch";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { CancelToken } from "axios";

interface BranchRepo {
  fetchBranches(params: FetchBranchesListParamsType): Promise<PaginationResponse<Branch>>;
  fetchBranchById(id: number): Promise<Branch>;
}

export default class BranchRepoImpl implements BranchRepo {

  fetchBranches(params: FetchBranchesListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<Branch>> {
    return new Promise<PaginationResponse<Branch>>((res, rej) => {
      instance.httpGet<PaginationResponse<Branch>>("/api/admin/branches", params, { cancelToken })
        .then(branchList => {
          res(branchList);
        })
        .catch(error => rej(error));
    });
  }

  fetchBranchesList(params: FetchBranchesListParamsType) {
    return instance.httpGet<Array<MapBranchI>>("/api/admin/branches/map", params)
  }

  fetchBranchById(id: number): Promise<Branch> {
    return new Promise<Branch>((res, rej) => {
      instance
        .httpGet<Branch>(`/api/branches/${id}`)
        .then(branch => {
          res(branch);
        })
        .catch(error => rej(error));
    });
  }

  fetchBranchItems(params: FetchBranchItemsType) {
    return instance.httpGet<Array<BranchItem>>("/api/admin/branches/search", params)
  }

  fetchBranchesCountByCtoId(params: FetchBranchesCountByCtoIdType) {
    return instance.httpGet<number>("/api/branches/count-by-tin", params)
  }
}
