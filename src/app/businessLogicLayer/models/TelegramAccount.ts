export interface CreateTelegramAccountI {
  companyId: number
  branchId?: number
  name: string
  phone: string
}

export interface UpdateTelegramAccountI {
  id: number;
  companyId: number
  branchId?: number
  name: string
  phone: string
}

export interface TelegramAccountsListFilterI {
  // branchId?: number;
  // from?: string;
  // to?: string;
  // search?: string;
  // includeVat?: string;
  // status?: string;
  // page?: number;
  // size?: number;
}

export interface FetchTelegramAccountsListParamsI extends TelegramAccountsListFilterI {
  companyId: number;
}

export interface TelegramAccountListItemI {
  branchId: number
  companyId: number
  confirmed: boolean
  enabled: boolean
  id: number
  langKey: string
  name: string
  phone: string
  telegramId: number
  userId: number
}

export interface TelegramAccountDetailsI extends CreateTelegramAccountI {}

export interface EnableTelegramAccountDataI {
  agreementId?: number
}

export interface EnableTelegramAccountParamsI {
  id: number
  data: EnableTelegramAccountDataI
}

export interface FetchAvailableTelegramAgreementsParamsI {
  companyId: number;
}