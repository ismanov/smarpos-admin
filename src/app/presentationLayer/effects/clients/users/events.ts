import { createEvent } from "effector";
import { FetchUsersListParamsType } from "app/businessLogicLayer/models/User";

export const updateUsersFilter = createEvent<FetchUsersListParamsType>();
export const resetUsersFilter = createEvent();