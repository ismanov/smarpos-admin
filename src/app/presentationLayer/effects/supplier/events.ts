import { createEvent } from "effector";
import { SupplierListFilterI, SupplierDetailsOrdersListFilterI } from "app/businessLogicLayer/models/Supplier";

// SUPPLIERS-LIST

export const updateSupplierListFilter = createEvent<SupplierListFilterI>();
export const resetSupplierListFilter = createEvent();

// SUPPLIERS-DETAILS

export const resetSupplierCard = createEvent();
export const updateSupplierDetailsOrdersListFilter = createEvent<SupplierDetailsOrdersListFilterI>();
export const resetSupplierDetailsOrdersListFilter = createEvent();

// Current order
export const resetSupplierDetailsCurrentOrder = createEvent();