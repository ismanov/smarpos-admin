import { createEvent } from "effector";
import { PromotionsListFilterType } from "app/businessLogicLayer/models/Promotions";

export const resetPromotionsListEvent = createEvent();
export const resetPromotionsStatsEvent = createEvent();
export const updatePromotionsListFilter = createEvent<PromotionsListFilterType>();
export const resetPromotionsListFilter = createEvent();

export const resetSearchProducts = createEvent();
export const resetProductUnitsItems = createEvent();

export const resetCreatePromotionEvent = createEvent();
export const resetUpdatePromotionEvent = createEvent();
export const resetChangePromotionStatusEvent = createEvent();

export const resetPromotionDetailsEvent = createEvent();