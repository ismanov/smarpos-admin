import { User } from "app/businessLogicLayer/models/User";
import { BusinessType } from "app/businessLogicLayer/models/BusinessType";

export interface ChequeStatusI {
  nameRu: string
  code: string
}

interface ReceiptDetail {
  amount: number;
  discount: number;
  discountPercent: number;
  nds: number;
  ndsPercent: number;
  price: number;
  productId: number;
  productName: string;
  qty: number;
  status: string;
}

export interface Cheque {
  branchAddress: string;
  branchId: number;
  branchName: string;
  createdDateTime: string;
  companyName: string;
  customerId: number;
  discountPercent: number;
  id: number;
  loyaltyCardId: number;
  companyId: number;
  receiptDateTime: string;
  receiptDetails: Array<ReceiptDetail>;
  shiftId: number;
  shiftNo: number;
  status: {
    code: string;
    nameRu: string;
  };
  terminalId: number;
  terminalModel: string;
  terminalSN: string;
  totalCard: number;
  totalCash: number;
  totalCost: number;
  totalDiscount: number;
  totalLoyaltyCard: number;
  totalNds: number;
  totalPaid: number;
  uid: string;
  user: User;
  userId: number;
  fiscalUrl?: string;
}

export interface ChequesListFilterI {
  search?: string,
  from?: string,
  to?: string,
  companyId?: number;
  branchId?: number;
  userId?: number;
  isFiscal?: string,
  totalCostFrom?: number;
  totalCostTo?: number;
  sortOrder?: string,
  orderBy?: string
  es?: boolean
  page?: number
  size?: number
  paymentTypes?: string
  status?: string
}

export interface FetchChequesListParamsI extends ChequesListFilterI {}

export interface ChequesStatsI {
  receipts: number;
  revenue: number
  discount: number
  cash: number;
  card: number;
  cardUzCard: number
  cardHumo: number;
  cardLoyalty: number;
  cardOther: number
  nds: number;
  positionsInReceipts: number;
}

// Cheques by branches

export interface ChequeByBranchI {
  id: number
  branchName?: string
  companyName?: string
  regionName?: string
  cityName?: string
  activityType?: string
  businessType?: BusinessType
  receipts?: number
  revenue?: number
}

export interface ChequesByBranchListFilterI {
  search?: string,
  from?: string,
  to?: string,
  companyId?: number;
  branchId?: number;
  regionId?: number;
  cityId?: number;
  activityTypeId?: number;
  sortOrder?: string,
  orderBy?: string
  es?: boolean
  page?: number
  size?: number
  paymentTypes?: string

}

export interface FetchChequesByBranchListParamsI extends ChequesByBranchListFilterI {}

export interface ChequesByBranchStats {
  branchCount: number;
  receiptCount: number;
  revenueCount: number
}

// Cheques by companies

export interface ChequeByCompaniesI {
  id: number
  companyName: string
  branchCount: number
  regionName: string
  cityName: string
  activityType: string
  receipts: number
  revenue: number
}

export interface ChequesByCompaniesStats {
  companyCount: number;
  receiptCount: number;
  revenueCount: number
}

export interface FetchCompanyStatisticsByMonthParamsI {
  companyId: number;
}

export interface CompanyStatisticsByMonthI {
  branches: number;
  cardHumo: number;
  cardHumoPercent: number;
  cardUzCard: number;
  cardUzCardPercent: number;
  cash: number;
  cashPercent: number;
  excise: number;
  excisePercent: number;
  monthNumber: number;
  nds: number;
  ndspercent: number;
  positionsInReceipts: number;
  positionsInReceiptsPercent: number;
  receipts: number;
  receiptsAvg: number;
  receiptsAvgPercent: number;
  receiptsPercent: number;
  revenue: number;
  revenuePercent: number;
}