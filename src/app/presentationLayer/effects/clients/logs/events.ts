import { createEvent } from "effector";
import { FetchLogsListParamsType } from "app/businessLogicLayer/models/Log";

export const updateLogsFilter = createEvent<FetchLogsListParamsType>();
export const resetLogsFilter = createEvent();