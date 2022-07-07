import instance from "app/businessLogicLayer/config/api";
import { PagingFilter } from "app/businessLogicLayer/models/PagingFilter";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import {
  FetchSupplierListParamsType,
  SUPPLIER,
  FetchSupplierDetailsOrdersListParamsType,
  SupplierOrder,
  SupplierCurrentOrder
} from "app/businessLogicLayer/models/Supplier";
import { CancelToken } from "axios";

interface SupplierRepo {
  fetchSupplierList(filter?: PagingFilter): Promise<PaginationResponse<SUPPLIER>>;
}

export default class SupplierRepoImpl implements SupplierRepo {
  fetchSupplierList(params: FetchSupplierListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<SUPPLIER>> {
    return instance.httpGet<PaginationResponse<SUPPLIER>>(
      "/api/admin/suppliers",
      params,
      { cancelToken }
    );
  }

  fetchSupplierDetails(id: number): Promise<SUPPLIER> {
    return instance.httpGet<SUPPLIER>(`/api/admin/suppliers/${id}`);
  }

  fetchSupplierDetailsOrders(params: FetchSupplierDetailsOrdersListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<SupplierOrder>> {
    return instance.httpGet<PaginationResponse<SupplierOrder>>(
      "/api/purchase/orders",
      params,
      { cancelToken }
    );
  }

  fetchSupplierDetailsCurrentOrder(id: number): Promise<SupplierCurrentOrder> {
    return instance.httpGet<SupplierCurrentOrder>(`/api/purchase/orders/${id}`);
  }
}
