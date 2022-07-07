interface ExciseHistory {
  createdBy: string;
  createdDate: string;
  id: number;
  lastModifiedBy: string;
  lastModifiedDate: string;
  newPrice: number;
  oldPrice: number;
}

export interface Excise {
  exciseAmount?: number;
  exciseHistories?: Array<ExciseHistory>;
  id?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  productId?: number;
  productName?: string;
  unitId?: number;
  unitName?: string;
  name?: string;
  oldPrice?: number;
  newPrice?: number;
}
