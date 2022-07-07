import instance from "app/businessLogicLayer/config/api";
import { PagingFilter } from "app/businessLogicLayer/models/PagingFilter";
import {
  Cheque,
  ChequeByBranchI, ChequeByCompaniesI,
  ChequesByBranchStats, ChequesByCompaniesStats, ChequesStatsI, ChequeStatusI, CompanyStatisticsByMonthI,
  FetchChequesByBranchListParamsI, FetchChequesListParamsI, FetchCompanyStatisticsByMonthParamsI
} from "app/businessLogicLayer/models/Cheque";
import { PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { CancelToken } from "axios";

interface ChequeRepo {
  fetchChequeList(
    filter: PagingFilter & { userId?: number; branchId?: number }
  ): Promise<PaginationResponse<Cheque>>;
  fetchChequeById(id: number): Promise<Cheque>;
  fetchChequesByBranch(filter: PagingFilter & {search?: string, from?: string, to?: string}): Promise<PaginationResponse<ChequeByBranchI>>
}

export default class ChequeRepoImpl implements ChequeRepo {
  fetchChequesStatuses(): Promise<ChequeStatusI[]> {
    return instance.httpGet<ChequeStatusI[]>("/api/receipt/statuses/all");
  }

  fetchChequeList(
    filter: PagingFilter & { userId?: number; branchId?: number },
    cancelToken?: CancelToken
  ): Promise<PaginationResponse<Cheque>> {
    return instance.httpGet<PaginationResponse<Cheque>>(
      `/api/admin/receipts${instance.makeQueryParams(filter)}`,
      null,
      { cancelToken }
    );
  }

  fetchChequesStats(params: FetchChequesListParamsI): Promise<ChequesStatsI> {
    return instance.httpGet<ChequesStatsI>("/api/admin/receipts/stat", params);
  }

  fetchChequeById(id: number): Promise<Cheque> {
    return instance.httpGet<Cheque>(`/api/receipt/getById/${id}`);
  }

  fetchChequesByBranch(params: FetchChequesByBranchListParamsI): Promise<PaginationResponse<ChequeByBranchI>> {
    return instance.httpGet<PaginationResponse<ChequeByBranchI>>("/api/admin/branch/receipts", params);
  }

  fetchChequesByBranchStats(params: FetchChequesByBranchListParamsI): Promise<ChequesByBranchStats> {
    return instance.httpGet<ChequesByBranchStats>("/api/admin/branch/receipts/stat", params);
  }

  fetchChequesByCompaniesList(params: FetchChequesByBranchListParamsI): Promise<PaginationResponse<ChequeByCompaniesI>> {
    return instance.httpGet<PaginationResponse<ChequeByCompaniesI>>("/api/admin/company/receipts", params);
  }

  fetchChequesByCompaniesStats(params: FetchChequesByBranchListParamsI): Promise<ChequesByCompaniesStats> {
    return instance.httpGet<ChequesByCompaniesStats>("/api/admin/company/receipts/stat", params);
  }

  fetchCompanyChequesByMonth(params: FetchCompanyStatisticsByMonthParamsI): Promise<CompanyStatisticsByMonthI[]> {
    return instance.httpGet<CompanyStatisticsByMonthI[]>("/api/receipt/month", params);
  }

  fetchBranchesStatistics(params: FetchCompanyStatisticsByMonthParamsI): Promise<CompanyStatisticsByMonthI[]> {
    return instance.httpGet<CompanyStatisticsByMonthI[]>("/api/receipt/month/branches", params);
  }

  fetchPaymentTypes(): Promise<Array<string>> {
    return instance.httpGet<Array<string>>("/api/receipt/payment-types")
  }
}
