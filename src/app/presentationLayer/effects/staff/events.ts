import { createEvent } from "effector";
import { UsersListFilterI } from "app/businessLogicLayer/models/User";

export const updateStaffListFilter = createEvent<UsersListFilterI>();
export const resetStaffListFilter = createEvent();

export const resetUpdateUser = createEvent();
export const resetUpdateUserLogin = createEvent();
export const resetExpireToken = createEvent();