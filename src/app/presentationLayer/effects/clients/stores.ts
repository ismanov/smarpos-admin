import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { LoadingI, SuccessStoreI } from "app/businessLogicLayer/models";
import { BranchItem } from "app/businessLogicLayer/models/Branch";
import { User } from "app/businessLogicLayer/models/User";
import { Contractor } from "app/businessLogicLayer/models/Contractor";
import { ProductUnitI } from "app/businessLogicLayer/models/Product";
import { CategoryItem } from "app/businessLogicLayer/models/Category";
import { Client, ClientsListFilterI, ClientStatI } from "app/businessLogicLayer/models/Client";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { ActivityType } from "app/businessLogicLayer/models/AcitivityType";
import { BusinessType } from "app/businessLogicLayer/models/BusinessType";
import { Vat } from "app/businessLogicLayer/models/Vat";


interface ActivityTypesItemsStoreI extends LoadingI {
  data: ActivityType[];
}

export const $activityTypesItems = createStore<ActivityTypesItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchActivityTypesItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchActivityTypesItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

  export const $sendSms = createStore<{loading:boolean; error:any}>({ loading: false, error: undefined })
  .on(effects.sendSmsEffect, (state) => ({
    ...state,
    loading: true,
    error: undefined
  }))
  .on(effects.fetchActivityTypesItemsEffect.done, (state) => ({
    ...state,
    loading: false,
  }))
  .on(effects.fetchActivityTypesItemsEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.message
  }))


interface BusinessTypesItemsStoreI extends LoadingI {
  data: BusinessType[];
}

export const $businessTypesItems = createStore<BusinessTypesItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchBusinessTypesItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchBusinessTypesItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));


interface VatsItemsStoreI extends LoadingI {
  data: Vat[];
}

export const $vatsItems = createStore<VatsItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchVatsItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchVatsItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));


interface BranchItemsStoreI extends LoadingI {
  data: BranchItem[];
}

export const $branchItems = createStore<BranchItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchBranchItems, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchBranchItems.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetClientCard);


interface UsersItemsStoreI extends LoadingI {
  data: User[];
}

export const $usersItems = createStore<UsersItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchUserItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchUserItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result.content
  }))
  .reset(events.resetUsersItems);


interface ContractorsItemsStoreI extends LoadingI {
  data: Contractor[];
}

export const $contractorsItems = createStore<ContractorsItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchContractorsItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchContractorsItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result.content
  }));


interface ProductUnitsItemsStoreI extends LoadingI {
  data: ProductUnitI[];
}

export const $productUnitsItems = createStore<ProductUnitsItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchProductUnitsItemsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchProductUnitsItemsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetProductUnitsItems);


interface CategoryItemsStoreI extends LoadingI {
  data: CategoryItem[];
}

export const $categoriesItems = createStore<CategoryItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchCategoryItems, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchCategoryItems.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetCategoryItems);

// Clients components

interface ClientsListStoreI extends LoadingI {
  data: PaginationResponse<Client>;
}

export const $clientsList = createStore<ClientsListStoreI & {requestError?: string | undefined, requestSend?: boolean}>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchClientsListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchClientsListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchClientsListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .on(effects.fetchClientsListForContentManagerEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchClientsListForContentManagerEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchClientsListForContentManagerEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .on(effects.postAccessKey.done, (state) => ({
    ...state,
    requestSend: true,
  }))
  .on(effects.postAccessKey.fail, (state, result) => ({
    ...state,
    requestSend: false,
    requestError: result.error.response && result.error.response.data
  }))
  .on(effects.sendAccessKey.done, (state, result) => {
    effects.fetchClientsListForContentManagerEffect(result.params.filter)
    return {
      ...state,
      requestSend: true,
    }
  })
  .on(events.resetRequestError, (state) => ({
    ...state,
    requestError: undefined
  }));

export const $clientsListFilter = createStore<ClientsListFilterI>({})
  .on(events.updateClientsListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetClientsListFilter);


interface ClientDetailsStoreI extends LoadingI {
  data: Client | null;
}

export const $clientDetails = createStore<ClientDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchClientDetails, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchClientDetails.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetClientCard);

  export const $confirmDetails = createStore<any>({ loading: false, data: null, error: undefined })
  .on(effects.sendConfirmSmsEffect, (state) => ({
    ...state,
    loading: true,
    error: undefined
  }))
  .on(effects.sendConfirmSmsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    error: undefined, 
    data: result.result
  }))
  .on(effects.sendConfirmSmsEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result?.error?.response?.data
  })).reset(events.resetConfirmData)

  export const $confirmRes = createStore<any>({ loading: false, data: null, error: undefined })
  .on(effects.ConfirmResEffect, (state) => ({
    ...state,
    loading: true,
    error: undefined
  }))
  .on(effects.ConfirmResEffect.done, (state, result) => ({
    ...state,
    loading: false,
    error: undefined,
    data: result.result
  }))
  .on(effects.ConfirmResEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result?.error?.response?.data
  })).reset(events.resetConfirmRes)


export const $updateClientDetails = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.updateClientDetailsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.updateClientDetailsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    success: true
  }))
  .on(effects.updateClientDetailsEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetUpdateClientDetails);


interface ClientStatStoreI extends LoadingI {
  data: ClientStatI | null;
}

export const $clientStat = createStore<ClientStatStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchClientStatEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchClientStatEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .on(effects.fetchClientStatEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetClientCard);