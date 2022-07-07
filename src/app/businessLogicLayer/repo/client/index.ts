import {
  Client, ClientStatI, CreateWarehouseIncomeI,
  CreateWarehouseOrderI,
  FetchCatalogParamsType, FetchCatalogProductsParamsType, FetchClientsListParamsType, FetchClientStatParamsI,
  FetchWarehouseIncomesListParamsType,
  FetchWarehouseOrdersListParamsType, FetchWarehouseStatI,
  FetchWarehouseStockListParamsType,
  WarehouseIncomeModel, WarehouseStatI,
  WarehouseStockByDayModel,
  WarehouseStockModel,
  WarehouseStockStatModel,
} from "app/businessLogicLayer/models/Client";
import instance from "app/businessLogicLayer/config/api";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchKkmsListParamsType, KKM } from "app/businessLogicLayer/models/KKM";
import { CancelToken } from "axios";
import { Contractor } from "app/businessLogicLayer/models/Contractor";
import { CategoryItem, FetchCategoryItemsI } from "app/businessLogicLayer/models/Category";
import {
  CreatePromotionI,
  FetchPromotionsListParamsType, PromotionDetailsI,
  PromotionListItemI, PromotionStats, UpdatePromotionI
} from "app/businessLogicLayer/models/Promotions";

interface ClientRepo {
  // fetchClients(
  //   filter: PagingFilter & {
  //     from?: string;
  //     to?: string;
  //     activityTypeId?: number;
  //     businessTypeId?: number;
  //     search?: string
  //   }
  // ): Promise<PaginationResponse<Client>>;

  fetchClientById(id: number): Promise<Client>;


  updateClient(client: Client): Promise<Client>;
}

export default class ClientRepoImpl implements ClientRepo {

  // fetchClients(
  //   filter?: PagingFilter & {
  //     from?: string;
  //     to?: string;
  //     activityTypeId?: number;
  //     businessType?: string;
  //     search?: string;
  //   }
  // ): Promise<PaginationResponse<Client>> {
  //   return instance.httpGet<PaginationResponse<Client>>(`/api/admin/company${instance.makeQueryParams(filter)}`);
  // }

  fetchClientsList(params: FetchClientsListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<Client>> {
    return instance.httpGet<PaginationResponse<Client>>("/api/admin/company", params, { cancelToken })
  }

  fetchClientsListContentManager(params: FetchClientsListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<Client>> {
    return instance.httpGet<PaginationResponse<Client>>("/api/company", params, { cancelToken })
  }

  searchClients(search?: string) {
    return instance.httpGet<Array<Client>>(`/api/admin/company?searchKey=${search}`);
  }

  fetchClientById(id: number): Promise<Client> {
    return instance.httpGet<Client>(`/api/company/${id}`);
  }

  updateClient(client: Client): Promise<Client> {
    return instance.httpPut<Client>("/api/admin/company", client);
  }

  setToClientWithTelegram(data: {id:number|string}): Promise<boolean> {
    return instance.httpPut<any>('/api/data-entry/telegram-message',data);
  }
  sendQuoteConfirmToClientWithTelegram(id: number): Promise<boolean> {
    return instance.httpPost<any>(`/api/quote/telegram/${id}`);
  }
  hasTelegram(phone: any): Promise<boolean> {
    return instance.httpGet<any>(`/api/admin/phone/${phone}/has-telegram`);
  }

  fetchClientStat(params: FetchClientStatParamsI): Promise<ClientStatI> {
    return instance.httpGet<ClientStatI>("/api/admin/company/receipts/stat", params)
  }

  fetchTerminals(params: FetchKkmsListParamsType): Promise<PaginationResponse<KKM>> {
    return instance.httpGet<PaginationResponse<KKM>>("/api/admin/terminals", params)
  }

  syncCatalog(data) {
    return instance.httpPut("/api/categories/transfer-catalog", data);
  }

  importProducts(file, params): Promise<any> {
    let data = new FormData();
    data.append('uploadFile', file);
    return instance.httpPost<any>(`/api/products/import${instance.makeQueryParams(params)}`, data, { headers: { 'Content-Type': 'multipart/form-data' }})
  }

  importProductsRef(file, params): Promise<any> {
    let data = new FormData();
    data.append('uploadFile', file);
    return instance.httpPost<any>(`/api/products/import/ref${instance.makeQueryParams(params)}`, data, { headers: { 'Content-Type': 'multipart/form-data' }})
  }

  downloadTemplate(params): Promise<any> {
    return instance.httpGet<any>("/api/product_excel_template", params, { responseType: 'blob' })
  }

  fetchCatalog(params: FetchCatalogParamsType): Promise<any> {
    return instance.httpGet<any>("/api/categories/enabled", params)
  }

  createCategory(data): Promise<any> {
    return instance.httpPost<any>("/api/categories", data);
  }

  deleteCategory({ params, data }): Promise<any> {
    return instance.httpPut<any>(`/api/categories/load-from-catalog${instance.makeQueryParams(params)}`, data);
  }

  fetchCatalogProducts(params: FetchCatalogProductsParamsType, cancelToken?: CancelToken): Promise<any> {
    return instance.httpGet<any>("/api/products/page/web", params, { cancelToken })
  }

  fetchCurrentProduct({ productId, ...params }): Promise<any> {
    return instance.httpGet<any>(`/api/products/${productId}`, params)
  }

  createCatalogProduct(data): Promise<any> {
    return instance.httpPost<any>("/api/products", data);
  }

  updateCatalogProduct(data): Promise<any> {
    return instance.httpPut<any>("/api/admin/products", data);
  }

  deleteCatalogProduct({ id, ...params }): Promise<any> {
    return instance.httpDelete<any>(`/api/products/${id}${instance.makeQueryParams(params)}`);
  }

  fetchWarehouseStat(params: FetchWarehouseStatI): Promise<WarehouseStatI> {
    return instance.httpGet<WarehouseStatI>("/api/warehouse/register/admin/stats", params)
  }

  fetchWarehouseOrdersList(params: FetchWarehouseOrdersListParamsType, cancelToken?: CancelToken): Promise<any> {
    return instance.httpGet<any>("/api/warehouse/purchase-order", params, { cancelToken })
  }

  fetchContractors(params): Promise<PaginationResponse<Contractor>> {
    return instance.httpGet<PaginationResponse<Contractor>>("/api/contractors", params)
  }

  createWarehouseOrder(data: CreateWarehouseOrderI): Promise<any> {
    return instance.httpPost<any>("/api/warehouse/purchase-order", data);
  }

  fetchWarehouseStockList(params: FetchWarehouseStockListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<WarehouseStockModel>> {
    return instance.httpGet<PaginationResponse<WarehouseStockModel>>("/api/warehouse/register", params, { cancelToken })
  }

  fetchWarehouseStockStat(params: FetchWarehouseStockListParamsType): Promise<WarehouseStockStatModel> {
    return instance.httpGet<WarehouseStockStatModel>("/api/warehouse/register/stats", params)
  }

  fetchCategoryItems(params: FetchCategoryItemsI): Promise<Array<CategoryItem>> {
    return instance.httpGet<Array<CategoryItem>>("/api/categories/search", params)
  }

  fetchWarehouseStockByDayList(params: FetchWarehouseStockListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<WarehouseStockByDayModel>> {
    return instance.httpGet<PaginationResponse<WarehouseStockByDayModel>>("/api/warehouse/register/history", params, { cancelToken })
  }

  fetchWarehouseIncomesList(params: FetchWarehouseIncomesListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<WarehouseIncomeModel>> {
    return instance.httpGet<PaginationResponse<WarehouseIncomeModel>>("/api/warehouse/income-of-product", params, { cancelToken })
  }

  createWarehouseIncome(data: CreateWarehouseIncomeI): Promise<any> {
    return instance.httpPost<any>("/api/warehouse/income-of-product", data);
  }

  // Promotions

  fetchPromotionsList(params: FetchPromotionsListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<PromotionListItemI>> {
    return instance.httpGet<PaginationResponse<PromotionListItemI>>("/api/admin/promotions", params, { cancelToken })
  }

  fetchPromotionsStats(params: FetchPromotionsListParamsType): Promise<PromotionStats> {
    return instance.httpGet<PromotionStats>("/api/admin/promotions/stats", params)
  }

  createPromotion(data: CreatePromotionI): Promise<any> {
    return instance.httpPost<any>("/api/admin/promotions/create", data);
  }

  sendConfirmSms(data: CreatePromotionI): Promise<any> {
    return instance.httpPost<any>("/api/operator-permission/create", data);
  }
  sendConfirmRes(data: CreatePromotionI): Promise<any> {
    return instance.httpPost<any>("/api/operator-permission/activate", data);
  }

  updatePromotion(data: UpdatePromotionI): Promise<any> {
    return instance.httpPut<any>("/api/admin/promotions/update", data);
  }

  changePromotionStatus({ promotionId, status,agreementId }:any): Promise<any> {
    return instance.httpPut<any>(`/api/promotions/changestatus/${promotionId}?status=${status}`, {agreementId});
  }

  fetchPromotionDetails(promotionId): Promise<PromotionDetailsI> {
    return instance.httpGet<PromotionDetailsI>(`/api/promotions/byId/${promotionId}`)
  }

  postAccessKeyToCompany(inn: string): Promise<void> {
    return instance.httpPost<void>('/api/company/send-access-key', { inn });
  }

  sendAccesskey(params: {inn: string, key: string}): Promise<void> {    
    return instance.httpPost<void>('/api/company/access-key', { inn: params.inn, key: params.key });
  }

}