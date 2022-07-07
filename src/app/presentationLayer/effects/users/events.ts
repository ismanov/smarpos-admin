import { createEvent } from "effector";
import { UsersListFilterI } from "app/businessLogicLayer/models/User";

export const updateUsersListFilter = createEvent<UsersListFilterI>();
export const resetUsersListFilter = createEvent();

export const resetUserDetails = createEvent();
export const resetCreateUser = createEvent();
export const resetUpdateUser = createEvent();