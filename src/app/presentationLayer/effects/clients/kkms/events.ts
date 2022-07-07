import { createEvent } from "effector";
import { FetchKkmsListParamsType } from "app/businessLogicLayer/models/KKM";

export const updateKkmsFilter = createEvent<FetchKkmsListParamsType>();
export const resetKkmsFilter = createEvent();