import { createEvent } from "effector";
import { UsersListFilterI } from "app/businessLogicLayer/models/User";

export const updateTgUsersListFilter = createEvent<UsersListFilterI>();
export const resetTgUsersListFilter = createEvent();