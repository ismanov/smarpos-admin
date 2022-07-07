import instance from "app/businessLogicLayer/config/api";
import { PagingFilter } from "app/businessLogicLayer/models/PagingFilter";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Excise } from "app/businessLogicLayer/models/Excise";
import {Product} from "app/businessLogicLayer/models/Product";

interface ExciseRepo {
  createExcise(excise: Excise): Promise<Excise>;
  updateExcise(excise: Excise): Promise<Excise>;
  fetchAllExcises(filter: PagingFilter): Promise<PaginationResponse<Excise>>;
  fetchExciseById(id: number): Promise<Excise>;
  deleteExcise(id: number): Promise<Excise>;
}

export default class ExciseRepoImpl implements ExciseRepo {
  createExcise(excise: Excise): Promise<Excise> {
    return instance.httpPost<Product>("/api/admin/excises", excise);
  }

  updateExcise(excise: Excise): Promise<Excise> {
    return instance.httpPut<Excise>("/api/admin/excises", excise);
  }

  deleteExcise(id: number): Promise<Excise> {
    return instance.httpDelete<Excise>(`/api/admin/excises/${id}`);
  }

  fetchAllExcises(filter: PagingFilter & {search?: string}): Promise<PaginationResponse<Excise>> {
    return instance.httpGet<PaginationResponse<Excise>>(`/api/admin/excises${instance.makeQueryParams(filter)}`);
  }

  fetchExciseById(id: number): Promise<Excise> {
    return instance.httpGet<Excise>(`/api/admin/excises/${id}`);
  }
}
