import { createEvent } from "effector";
import { ClientsListFilterI } from "app/businessLogicLayer/models/Client";

export const updateClientsListFilter = createEvent<ClientsListFilterI>();
export const resetClientsListFilter = createEvent();
export const resetClientCard = createEvent();
export const resetConfirmData = createEvent();
export const resetConfirmRes = createEvent();
export const resetUpdateClientDetails = createEvent();

export const resetUsersItems = createEvent();
export const resetProductUnitsItems = createEvent();
export const resetCategoryItems = createEvent();
export const resetRequestError = createEvent();