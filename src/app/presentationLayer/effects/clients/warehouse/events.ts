import { createEvent } from "effector";
import {
  WarehouseIncomesListFilterType,
  WarehouseStockByDayListFilterType,
  WarehouseStockListFilterType
} from "app/businessLogicLayer/models/Client";

export const updateWarehouseStockListFilter = createEvent<WarehouseStockListFilterType>();
export const resetWarehouseStockListFilter = createEvent();

export const updateWarehouseStockByDayListFilter = createEvent<WarehouseStockByDayListFilterType>();
export const resetWarehouseStockByDayListFilter = createEvent();

export const updateWarehouseIncomesListFilter = createEvent<WarehouseIncomesListFilterType>();
export const resetWarehouseIncomesListFilter = createEvent();

export const resetCreateWarehouseIncomeEvent = createEvent();
export const resetCreateWarehouseOrderEvent = createEvent();

export const resetSearchProducts = createEvent();