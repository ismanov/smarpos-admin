import instance from "app/businessLogicLayer/config/api";
import { PagingFilter } from "app/businessLogicLayer/models/PagingFilter";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { FetchKkmsListParamsType, KKM } from "app/businessLogicLayer/models/KKM";
import { CancelToken } from "axios";

interface KKMRepo {
  fetchKKMList(filter?: PagingFilter): Promise<PaginationResponse<KKM>>;

  syncKKM(terminalId: number): {};
}

export default class KKMRepoImpl implements KKMRepo {
  fetchKKMList(params: FetchKkmsListParamsType, cancelToken?: CancelToken): Promise<PaginationResponse<KKM>> {
    return instance.httpGet<PaginationResponse<KKM>>(
      "/api/admin/terminals",
      params,
      { cancelToken }
    );
  }

  syncKKM(id: number) {
    return instance.httpGet(
      `/api/terminal/sync?id=${id}`
    );
  }

  deleteKKM(id: number) {
    return instance.httpDelete(`/api/admin/terminals/${id}`);
  }
}
