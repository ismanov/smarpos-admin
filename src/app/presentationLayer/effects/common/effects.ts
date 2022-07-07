import { createEffect } from "effector";
import { AxiosError } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Client, FetchClientsListParamsType } from "app/businessLogicLayer/models/Client";
import { BranchItem, FetchBranchItemsType } from "app/businessLogicLayer/models/Branch";
import { Role } from "app/businessLogicLayer/models/Role";


export const searchCompanyItemsEffect = createEffect<FetchClientsListParamsType, PaginationResponse<Client>, AxiosError>({
  handler: Repository.owner.fetchOwners
});

export const fetchBranchItemsEffect = createEffect<FetchBranchItemsType, BranchItem[], AxiosError>({
  handler: Repository.branch.fetchBranchItems
});

export const fetchUsersRolesEffect = createEffect<void, Role[], AxiosError>({
  handler: Repository.resources.fetchUsersRoles
});
export const createAndUpdateTerminalEffect = createEffect<any, any, AxiosError>({
  handler: Repository.resources.createAndUpdateTerminal
});