import { createEvent } from "effector";
import { ChequesListFilterI } from "app/businessLogicLayer/models/Cheque";

export const updateChequesListFilter = createEvent<ChequesListFilterI>();
export const resetChequesListFilter = createEvent();

export const resetChequeDetailsEvent = createEvent();
export const resetChequeStatisticsEvent = createEvent();
