import {Category} from "app/businessLogicLayer/models/Category";

export interface Product {
  id?: number;
  name?: string;
  categoryName?: string;
  exciseAmount?: number;
  barcode?: string;
  branchId?: number;
  categoryDTO?: Category;
  createdBy?: string;
  createdDate?: string;
  currBalance?: number;
  custom?: boolean;
  description?: string;
  enabled?: boolean;
  favorite?: boolean;
  hasExcise?: boolean;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  measurement?: string;
  model?: string;
  noVat?: boolean;
  packageType?: {
    code?: number;
    countable?: boolean;
    description?: string;
    id: number;
    name?: string;
    nameRu?: string;
    nameUz?: string;
  }
  salesPrice?: number;
  unit?: {
    code?: number;
    countable?: boolean;
    description?: string;
    id: number;
    name?: string;
    nameRu?: string;
    nameUz?: string;
  }
}


export interface MonitoringProduct {
  productId: number;
  productName: string;
  amountSold: number | null;
  branchName: string | null;
  categoryName: string;
  owner: string | null;
  totalSum: number | null
}

export interface SearchProductI {
  id: number
  name: string
  barcode: string
  description: string
  disabled?:any
}

export interface ProductUnitI {
  id: number
  name: string
  description: string | null
  price: number | null
  base: boolean
}

export interface SearchProductsType {
  search?: string
  companyId?: number
  branchId?: number
  withBalance?: boolean
}

export interface FetchProductUnitsType {
  productId: number
  branchId: number
}