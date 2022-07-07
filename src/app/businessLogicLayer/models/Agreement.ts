export interface CustomerPublicOfferI {
  createdDate: string
  customerId: string
  customerTin: string
  id: string
  publicOfferContent: string
  publicOfferId: string
}

export interface LastActiveQuoteI {
  id: string
  content: string
  active: boolean
}

export interface AcceptPublicOfferI {
  tin: number
  publicOfferId: string
}

export interface AgreementsListFilterI {
  serviceType?: string;
  recurring?: string;
  status?: string;
  search?: string;
}

export interface FetchAgreementsListParamsI extends AgreementsListFilterI {
  tin: string;
}

export interface AgreementListItemI {
  id: number
  name: string
  dateFrom: string
  dateTo: string
  hits: number
  status: string
}

// export interface AgreementsStatsI {
//   activeServices: number,
//   finishedServices: number,
//   hitCount: number
// }

export interface ChangeQuoteStatusParamsI {
  id: number
  contractStatus: string
}

export interface UploadQuoteFileI {
  id: number
  file: any
}