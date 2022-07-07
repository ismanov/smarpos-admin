import instance from "app/businessLogicLayer/config/api";
import { CancelToken, CancelTokenSource, AxiosResponse } from "axios";
import {
  FetchProductUnitsType,
  MonitoringProduct,
  Product, ProductUnitI, SearchProductI,
  SearchProductsType
} from "app/businessLogicLayer/models/Product";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";


interface ProductRepo {
  searchProduct(filter: { searchKey?: string }): Promise<Array<Product>>;
  fetchProductsForCategoryId(filter: {categoryId: number}): Promise<Array<Product>>
  downloadTemplate(filter: {categoryId?: number}): Promise<Blob>
  uploadTemplate(file: File, filter: {categoryId?: number}): Promise<{}>
}

export default class ProductRepoImpl implements ProductRepo {
  fetchMonitoringProducts(params: any, cancelToken?: CancelToken): Promise<PaginationResponse<MonitoringProduct>> {
    return instance.httpGet<PaginationResponse<MonitoringProduct>>("/api/admin/products/monitoring", params, {cancelToken});
  }

  searchProduct(
    filter: { searchKey?: string },
    cancelToken?: CancelTokenSource
  ): Promise<Array<Product>> {
    return instance.httpGet<Array<Product>>(
      `/api/admin/products/search${instance.makeQueryParams(filter)}`,
      null,
      { cancelToken: cancelToken ? cancelToken.token : undefined }
    );
  }

  fetchProductsForCategoryId(filter: {categoryId: number}): Promise<Array<Product>> {
    return instance.httpGet<Array<Product>>(`/api/admin/products${instance.makeQueryParams(filter)}`);
  }
  downloadTemplate(filter: { categoryId?: number }): Promise<Blob> {
    return instance.httpGet<Blob>(`/api/product_excel_template${instance.makeQueryParams(filter)}`, null, { responseType: 'blob' })
  }
  uploadTemplate(file: File, filter: {categoryId?: number}): Promise<AxiosResponse<string>> {
    let form = new FormData();
    form.append('uploadFile', file);
    if (filter.categoryId !== undefined) {
      form.append('categoryId', `${filter.categoryId}`)
    }
    return instance.httpPostResponse('/api/admin/products/import/ref', form, {
      headers: {
        "Content-Type": "multipart/form-data",
        responseType: "blob",
      }
    })
  }

  searchProducts(params: SearchProductsType, cancelToken?: CancelToken): Promise<Array<SearchProductI>> {
    return instance.httpGet<Array<SearchProductI>>(
      "/api/products/search",
      params,
      { cancelToken }
    );
  }

  searchProductsInBranch(params: SearchProductsType, cancelToken?: CancelToken): Promise<Array<SearchProductI>> {
    return instance.httpGet<Array<SearchProductI>>(
      "/api/products/searchinbranch",
      params,
      { cancelToken }
    );
  }

  fetchProductUnits(params: FetchProductUnitsType): Promise<Array<ProductUnitI>> {
    return instance.httpGet<Array<ProductUnitI>>(`/api/product/productUnits/${params.productId}/${params.branchId}`);
  }
}
