import { ActivityType } from "app/businessLogicLayer/models/AcitivityType";
import { City } from "app/businessLogicLayer/models/City";
import { Region } from "app/businessLogicLayer/models/Region";

export interface BranchesListFilterI {
  companyId?: number;
  branchId?: number;
  from?: string;
  to?: string;
  search?: string;
  page?: number
  size?: number
}

export interface FetchBranchesListParamsType extends BranchesListFilterI {}

export interface Branch {
  id: number;
  activityTypeDTO?: ActivityType;
  address: string;
  canDoSales: boolean;
  city: City;
  confirmationCode: string;
  createdById: number;
  createdDateTime: string;
  deleted: boolean;
  description: string;
  mainBranch: boolean;
  name: string;
  companyId: number;
  phone: string;
  reasonForDeletion: string;
  region: Region;
  updatedById: number;
  updatedDateTime: string;
  userCount: number;
  companyName: string;
  terminalCount: number;
}

export interface BranchItem {
  id: number;
  name: string;
}

export interface FetchBranchItemsType {
  companyId: number;
  searchKey?: string;
  size?: number
}

export interface MapBranchI {
  id: number;
  name: string;
  phone: string;
  longitude: string;
  latitude: string;
  customer: string;
  tin: string;
  activityType: string;
}

export interface FetchBranchesCountByCtoIdType {
  tin : string;
}