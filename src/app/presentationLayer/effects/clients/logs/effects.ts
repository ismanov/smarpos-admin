import { createEffect } from "effector";
import { AxiosError } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchLogsListParamsType, Log } from "app/businessLogicLayer/models/Log";


export const fetchLogsListEffect = createEffect<FetchLogsListParamsType, PaginationResponse<Log>, AxiosError>().use(async params => {
  return await Repository.log.fetchLog(params)
});