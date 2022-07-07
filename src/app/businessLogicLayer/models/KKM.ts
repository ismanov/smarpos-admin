export interface KKM {
  companyName: string;
  branchAddress?: string;
  branchId?: number;
  branchName?: string;
  createdById?: number;
  createdDateTime?: string;
  id: number;
  model?: string;
  serialNumber?: string;
  terminalId?: number;
  lastModifiedBy?: number;
  lastModifiedDate?: string;
}

export interface KkmsListFilterI {
  companyId?: number;
  branchId?: number;
  search?: string;
  page?: number
  size?: number
}

export interface FetchKkmsListParamsType extends KkmsListFilterI {}