import { createEffect } from "effector";
import { AxiosError } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Branch, FetchBranchesListParamsType } from "app/businessLogicLayer/models/Branch";


export const fetchBranchesListEffect = createEffect<FetchBranchesListParamsType, PaginationResponse<Branch>, AxiosError>().use(async params => {
  return await Repository.branch.fetchBranches(params);
});