import { FullName } from "app/businessLogicLayer/models/FullName";
import { City } from "app/businessLogicLayer/models/City";
import { Region } from "app/businessLogicLayer/models/Region";
import { BusinessType } from "app/businessLogicLayer/models/BusinessType";
import { ActivityType } from "app/businessLogicLayer/models/AcitivityType";
import { Product, SearchProductI } from "app/businessLogicLayer/models/Product";

export interface ClientsListFilterI {
  from?: string;
  to?: string;
  search?: string;
  activityTypeId?: number,
  businessType?: string,
  page?: number;
  size?: number;
}

export interface FetchClientsListParamsType extends ClientsListFilterI {}

export interface Client {
  id: number;
  ctoId: number;
  createdDateTime: string;
  createdDate: string;
  createdById: number;
  updatedById: number;
  updatedDateTime: string;
  contactFullName: FullName;
  email: string;
  phone: string;
  userId: number;
  inn: string;
  name: string;
  businessType: BusinessType;
  address: string;
  region: Region;
  city: City;
  oked: string;
  brand: string;
  companyCreationDate: string;
  companyPhone: string;
  directorFullName: string;
  bankAccountNo: string;
  bankName: string;
  bankMFO: string;
  canMainBranchDoSales: boolean;
  types: Array<ActivityType>;
  paysNds: boolean;
  ndsPercent: number;
  warehouseEnabled: boolean;
  lastModifiedDate?: string;
  syncDate?: string
}

export interface FetchClientStatParamsI {
  companyId?: number;
  es?: boolean
}

export interface ClientStatI {
  companyCount: number
  branchCount: number
  receiptCount: number
  revenueCount: number
  terminalCount: number
}

export interface FetchCatalogParamsType {
  branchId?: number
}

export interface FetchCatalogProductsParamsType {
  branchId: number
  categoryId: number
}

export interface FetchWarehouseStatI {
  companyId?: number;
}

export interface WarehouseStatI {
  productCount: number
  totalCostPrice: number
  totalSalesPrice: number
}

export interface WarehouseOrdersListFilterType {
  branchId?: number;
  from?: string;
  to?: string;
  userId?: number;
  page?: number;
  size?: number;
  search?: string;
  isFiscal?: boolean
}

export interface FetchWarehouseOrdersListParamsType extends WarehouseOrdersListFilterType {
  companyId: number;
}

export interface WarehouseStockListFilterType {
  branchId?: number;
  page?: number;
  size?: number;
  search?: string;
  categoryIds?: string
  productId?: string
}

export interface FetchWarehouseStockListParamsType extends WarehouseStockListFilterType {
  companyId: number;
}

export interface WarehouseStockByDayListFilterType {
  branchId?: number;
  page?: number;
  size?: number;
  balanceDate?: string;
  search?: string;
  categoryIds?: string
  productId?: string
}

export interface FetchWarehouseStockByDayListParamsType extends WarehouseStockByDayListFilterType {
  companyId: number;
}

export interface WarehouseIncomesListFilterType {
  branchId?: number;
  from?: string;
  to?: string;
  userId?: number;
  page?: number;
  size?: number;
  search?: string;
  contractorId?: boolean
}

export interface FetchWarehouseIncomesListParamsType extends WarehouseIncomesListFilterType {
  companyId: number;
}

export interface OrderProductI {
  product: SearchProductI
  unitId: number
  unitName: string
  qty: number
  costPrice: number
  totalCost: number
}

export interface AdditionalI {
  name: string
  amount: string
}

interface CreateWarehouseOrderContractor {
  id: number
}

interface CreateWarehouseOrderBranch {
  id: number
}

interface CreateWarehouseOrderStatus {
  code: string
}

export interface WarehouseStockStatModel {
  productCount: number
  totalCostPrice: number
  totalSalesPrice: number
}

export interface WarehouseStockModel {
  branch: { id: number; name: string; description: string | null; }
  costPrice: number
  margin: number
  product: Product
  profit: number
  qty: number
  salesPrice: number
  totalCostPrice: number
  totalSalesPrice: number
  unit: { id: number; name: string; description: string | null; }
}

export interface WarehouseStockByDayModel {
  balanceStart: number
  income: number
  sale: number
  back: number
  transferIn: number
  transferOut: number
  stockAdjustment: number
  balanceEnd: number
  balanceDate: string
  product: { id: number; name: string; description: string | null; price: number | null }
  unit: { id: number; name: string; description: string | null; price: number | null }
  branch: { id: number; name: string; description: string | null; price: number | null }
}

export interface WarehouseIncomeModel {
  id: number
  createdDate: string
  contractor: { id: number; name: string; description: string | null; }
  toBranch: { id: number; name: string; description: string | null; }
}

export interface WarehouseIncomeProductI {
  product: any
  unit: any
  unitId: number
  unitName: string
  qty: number
  costPrice: number
  markup: number
  salesPrice: number
  totalCost: number
}

export interface CreateWarehouseIncomeI {
  toBranchId: number
  contractor: CreateWarehouseOrderContractor
  documentDate: string
  incomeOfProductDetails: WarehouseIncomeProductI[]
  comment: string
}

export interface CreateWarehouseOrderI {
  additionalCosts: AdditionalI[]
  contractor: CreateWarehouseOrderContractor
  orderDate: string
  expectedDate: string
  orderItems: OrderProductI[]
  toBranch?: CreateWarehouseOrderBranch
  toBranchId?: number;
  status: CreateWarehouseOrderStatus
  description: string
}

