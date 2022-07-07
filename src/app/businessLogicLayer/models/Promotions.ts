export interface CreatePromotionConditionI {
  promotionOn: string
  promotedProductId?: number
  promotedProductName?: string
  unitId?: number
  amount: number;
  amountTo?: number;
  sortIndex: number
}

export interface CreatePromotionBonusI {
  bonusOn: string;
  bonusProductId: number;
  bonusProductName: string
  unitId: number;
  allProducts: boolean;
  productCount?: number;
  bonusType: string;
  bonusAmount: number;
  sortIndex: number
}

export interface CreatePromotionI {
  companyId: number
  branchId: number
  name: string
  dateFrom: string
  dateTo?: string
  repeatType: string
  repeats?: number[]
  includeVAT: boolean
  countRepetitions: boolean
  conditions: CreatePromotionConditionI[]
  bonuses: CreatePromotionBonusI[]
  agreementId?:number
}

export interface UpdatePromotionI {
  id: number;
  companyId: number
  branchId: number
  name?: string
  dateFrom?: string
  dateTo?: string
  repeatType?: string
  repeats?: number[]
  agreementId?: any
}

export interface ChangePromotionStatusI {
  promotionId : number;
  status: string;
  agreementId: string|null|undefined 
}

export interface PromotionDetailsI extends CreatePromotionI {
  promotionStatus: string
}

export interface PromotionsListFilterType {
  branchId?: number;
  from?: string;
  to?: string;
  search?: string;
  includeVat?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface FetchPromotionsListParamsType extends PromotionsListFilterType {
  companyId: number;
}

export interface PromotionListItemI {
  id: number
  name: string
  dateFrom: string
  dateTo: string
  hits: number
  status: string
}

export interface PromotionStats {
  activePromotions: number,
  finishedPromotions: number,
  hitCount: number
}