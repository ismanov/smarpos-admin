import instance from "app/businessLogicLayer/config/api";
import { PagingFilter } from "app/businessLogicLayer/models/PagingFilter";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Unit, UnitItem } from "app/businessLogicLayer/models/Unit";

interface UnitsRepo {
  fetchUnits(filter: PagingFilter): Promise<PaginationResponse<Unit>>;
  updateUnit(unit: Unit): Promise<Unit>;
}

export default class UnitsRepoImpl implements UnitsRepo {
  fetchUnits(filter: PagingFilter): Promise<PaginationResponse<Unit>> {
    return instance.httpGet<PaginationResponse<Unit>>(
      `/api/admin/unit${instance.makeQueryParams(filter)}`
    );
  }
  updateUnit(unit: Unit): Promise<Unit> {
    return instance.httpPut("/api/admin/unit", unit);
  }

  fetchUnitsItems(params): Promise<UnitItem[]> {
    return instance.httpGet<UnitItem[]>("/api/product/units", params);
  }
}
