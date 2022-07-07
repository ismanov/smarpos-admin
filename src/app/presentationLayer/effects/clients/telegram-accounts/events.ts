import { createEvent } from "effector";
import { TelegramAccountsListFilterI } from "app/businessLogicLayer/models/TelegramAccount";

export const updateTelegramAccountsListFilter = createEvent<TelegramAccountsListFilterI>();
export const resetTelegramAccountsListFilter = createEvent();

export const resetTelegramAccountDetails = createEvent();

export const resetCreateTelegramAccount = createEvent();
export const resetUpdateTelegramAccount = createEvent();
export const resetDeleteTelegramAccount = createEvent();

export const resetEnableTelegramAccount = createEvent();
export const resetDisableTelegramAccount = createEvent();