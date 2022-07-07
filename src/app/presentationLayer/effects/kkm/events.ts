import { createEvent } from "effector";
import { KkmsListFilterI } from "app/businessLogicLayer/models/KKM";

export const updateKkmListFilter = createEvent<KkmsListFilterI>();
export const resetKkmListFilter = createEvent();

export const resetSyncKkm = createEvent();
export const resetDeleteKkm = createEvent();