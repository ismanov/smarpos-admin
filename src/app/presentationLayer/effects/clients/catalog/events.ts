import { createEvent } from "effector";
import { FetchCatalogParamsType } from "app/businessLogicLayer/models/Client";

export const updateCatalogFilter = createEvent<FetchCatalogParamsType>();
export const resetCatalogFilter = createEvent();

export const resetSyncCatalogEvent = createEvent();
export const resetCreateCategoryEvent = createEvent();
export const resetDeleteCategoryEvent = createEvent();
export const resetCatalogProductsEvent = createEvent();
export const resetCurrentProductEvent = createEvent();
export const resetCreateCatalogProductEvent = createEvent();
export const resetUpdateCatalogProductEvent = createEvent();
export const resetDeleteCatalogProductEvent = createEvent();