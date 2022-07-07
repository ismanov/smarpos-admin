export interface SUPPLIER {
  id: number;
  name: string;
  tin: string;
  createdDate: string;
  totalOrder: number;
  totalCompletedOrder: number;
  totalCompletedAmount: number;
  totalBranch: number;
  address: {
    region: {
      name: string;
    };
    city: {
      name: string;
    };
    address: string;
  };
  owner: {
    firstName: string;
    lastName: string;
    patronymic: string;
    phone: string
  }
}

export interface SupplierListFilterI {
  companyId?: number;
  branchId?: number;
  search?: string;
  page?: number;
  size?: number;
}

export interface FetchSupplierListParamsType extends SupplierListFilterI {}

// SUPPLIER-DETAILS

export interface SupplierOrder {
  id: number;
  number: string;
  branch: {
    name: string;
  };
  customer: {
    name: string;
  };
  total: number;
  orderDate: string;
  status: {
    nameRu: string;
  };
}

export interface SupplierDetailsOrdersListFilterI {
  page?: number;
  size?: number;
  supplierId?: number;
  search?: string;
}

export interface FetchSupplierDetailsOrdersListParamsType extends SupplierDetailsOrdersListFilterI {}

// Current order
interface SupplierCurrentOrderProductUnit {
  name: string;
  selected: boolean;
  minOrder: number;
}

interface SupplierCurrentOrderProduct {
  id: number;
  costPrice: number;
  noVat: boolean;
  product: {
    name: string;
  };
  qty: number;
  units: SupplierCurrentOrderProductUnit[]
}

export interface SupplierCurrentOrder extends SupplierOrder {
  deliveryType: {
    nameRu: string;
  };
  paymentType: {
    nameRu: string;
  };
  orderItems: SupplierCurrentOrderProduct[]
}