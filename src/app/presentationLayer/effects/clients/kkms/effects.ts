import { createEffect } from "effector";
import { AxiosError } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchKkmsListParamsType, KKM } from "app/businessLogicLayer/models/KKM";


export const fetchKkmsListEffect = createEffect<FetchKkmsListParamsType, PaginationResponse<KKM>, AxiosError>().use(async params => {
  return await Repository.client.fetchTerminals(params)
});