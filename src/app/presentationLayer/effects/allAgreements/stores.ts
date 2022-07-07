import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { resetClientCard } from "../clients/events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import {
  AgreementsListFilterI,
  CustomerPublicOfferI,
  LastActiveQuoteI
} from "app/businessLogicLayer/models/Agreement";
import { LoadingI, SuccessStoreI } from "app/businessLogicLayer/models";


interface CustomerBalanceStoreI extends LoadingI {
  data: number | null;
}

export const $customerBalance = createStore<CustomerBalanceStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchCustomerBalance.pending, (state, loading) => ({
    ...state,
    loading
  }))
  .on(effects.fetchCustomerBalance.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchCustomerBalance.fail, (state, response) => ({
    ...state,
    data: null,
    error: response.error.response && response.error.response.data
  }))
  .reset(resetClientCard);


interface BranchesCountStoreI extends LoadingI {
  data: number | null;
}

export const $branchesCount = createStore<BranchesCountStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchBranchesCount.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchBranchesCount.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchBranchesCount.fail, (state, response) => ({
    ...state,
    data: null,
    error: response.error.response && response.error.response.data
  }));


interface AgreementStatusesStoreI extends LoadingI {
  data: any[];
}

export const $agreementStatuses = createStore<AgreementStatusesStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchAgreementStatuses.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchAgreementStatuses.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchAgreementStatuses.fail, (state, response) => ({
    ...state,
    data: [],
    error: response.error.response && response.error.response.data
  }));


interface ServicesTypesStoreI extends LoadingI {
  data: any[];
}

export const $servicesTypes = createStore<ServicesTypesStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchServicesTypes.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchServicesTypes.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchServicesTypes.fail, (state, response) => ({
    ...state,
    data: [],
    error: response.error.response && response.error.response.data
  }));


interface TariffsItemsStoreI extends LoadingI {
  data: any[];
}

export const $tariffsItems = createStore<TariffsItemsStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchTariffsItems.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchTariffsItems.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchTariffsItems.fail, (state, response) => ({
    ...state,
    data: [],
    error: response.error.response && response.error.response.data
  }));


interface CustomerPublicOfferStoreI extends LoadingI {
  loaded: boolean
  data: CustomerPublicOfferI | null;
}

export const $customerPublicOffer = createStore<CustomerPublicOfferStoreI>({ loading: false, loaded: false, data: null, error: undefined })
  .on(effects.fetchCustomerPublicOffer.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchCustomerPublicOffer.done, (state, response) => ({
    ...state,
    loaded: true,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchCustomerPublicOffer.fail, (state, response) => ({
    ...state,
    loaded: true,
    data: null,
    error: response.error.response && response.error.response.data
  }))
  .reset(events.resetCustomerPublicOffer);


interface LastPublicOfferStoreI extends LoadingI {
  data: LastActiveQuoteI | null;
}

export const $lastPublicOffer = createStore<LastPublicOfferStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchLastPublicOffer.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchLastPublicOffer.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchLastPublicOffer.fail, (state, response) => ({
    ...state,
    data: null,
    error: response.error.response && response.error.response.data
  }));


export const $acceptPublicOffer = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.acceptPublicOffer, (state) => {
    return {
      ...state,
      loading: true,
    };
  })
  .on(effects.acceptPublicOffer.done, (state) => {
    return {
      ...state,
      loading: false,
      success: true,
      error: undefined
    };
  })
  .on(effects.acceptPublicOffer.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetAcceptPublicOffer);


interface AgreementsListStoreI extends LoadingI {
  data: any[];
}

export const $agreementsList = createStore<AgreementsListStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchAgreementsList.pending, (state, loading) => ({
    ...state,
    loading
  }))
  .on(effects.fetchAgreementsList.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchAgreementsList.fail, (state, response) => ({
    ...state,
    data: [],
    error: response.error.response && response.error.response.data
  }))
  .reset(resetClientCard);


export const $agreementsListFilter = createStore<AgreementsListFilterI>({})
  .on(events.updateAgreementsListFilter, (state, props) => ({ ...state, ...props }))
  .reset(events.resetAgreementsListFilter);


// interface AgreementsStatsStoreI extends LoadingI {
//   data: AgreementsStatsI | null;
// }
//
// export const $agreementsStats = createStore<AgreementsStatsStoreI>({ loading: false, data: null, error: undefined })
//   .on(effects.fetchAgreementsStats, (state) => ({
//     ...state,
//     loading: true
//   }))
//   .on(effects.fetchAgreementsStats.done, (state, result) => ({
//     ...state,
//     loading: false,
//     data: result.result
//   }))
//   .reset(events.resetServicesStatsEvent);


export const $activateAgreement = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.activateAgreement, (state) => {
    return {
      ...state,
      loading: true,
    };
  })
  .on(effects.activateAgreement.done, (state, response) => {
    return {
      ...state,
      loading: false,
      success: true,
      error: undefined
    };
  })
  .on(effects.activateAgreement.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetActivateAgreement);

export const $pauseAgreement = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.pauseAgreement, (state) => {
    return {
      ...state,
      loading: true,
    };
  })
  .on(effects.pauseAgreement.done, (state, response) => {
    return {
      ...state,
      loading: false,
      success: true,
      error: undefined
    };
  })
  .on(effects.pauseAgreement.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetPauseAgreement);

export const $cancelAgreement = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.cancelAgreement, (state) => {
    return {
      ...state,
      loading: true,
    };
  })
  .on(effects.cancelAgreement.done, (state, response) => {
    return {
      ...state,
      loading: false,
      success: true,
      error: undefined
    };
  })
  .on(effects.cancelAgreement.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetCancelAgreement);


export const $createSubscriptionAgreement = createStore({ loading: false, tariffId: null, success: false, error: undefined })
  .on(effects.createSubscriptionAgreement, (state, payload) => {
    return {
      ...state,
      loading: true,
      tariffId: payload.xizmat.id
    };
  })
  .on(effects.createSubscriptionAgreement.done, (state) => {
    return {
      ...state,
      loading: false,
      success: true,
      error: undefined
    };
  })
  .on(effects.createSubscriptionAgreement.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetCreateAgreement);


export const $createCustomAgreement = createStore<any>({ loading: false, successData: null, error: undefined })
  .on(effects.createCustomAgreement, (state) => {
    return {
      ...state,
      loading: true,
    };
  })
  .on(effects.createCustomAgreement.done, (state, response) => {
    return {
      ...state,
      loading: false,
      successData: response.result,
      error: undefined
    };
  })
  .on(effects.createCustomAgreement.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      successData: null,
      error: response.error
    };
  })
  .reset(events.resetCreateCustomAgreement);

export const $updateSubAgreement = createStore({ loading: false, successData: null, error: undefined })
  .on(effects.updateSubAgreement, (state) => {
    return {
      ...state,
      loading: true,
    };
  })
  .on(effects.updateSubAgreement.done, (state, response) => {
    return {
      ...state,
      loading: false,
      successData: response.result,
      error: undefined
    };
  })
  .on(effects.updateSubAgreement.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      successData: null,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetUpdateSubAgreement);


interface AgreementDetailsStoreI extends LoadingI {
  data: any;
}

export const $agreementDetails = createStore<AgreementDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchAgreementDetails.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchAgreementDetails.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchAgreementDetails.fail, (state, response) => ({
    ...state,
    data: null,
    error: response.error.response && response.error.response.data
  }))
  .reset(events.resetAgreementCard);


interface UpdateCustomAgreementServiceStoreI extends SuccessStoreI {
  agreementId: number | null;
}

export const $updateCustomAgreementServiceDesc = createStore<UpdateCustomAgreementServiceStoreI>({ loading: false, success: false, agreementId: null, error: undefined })
  .on(effects.updateCustomAgreementServiceDesc, (state, params) => {
    return {
      ...state,
      loading: true,
      agreementId: params.id
    };
  })
  .on(effects.updateCustomAgreementServiceDesc.done, (state) => {
    return {
      ...state,
      loading: false,
      success: true,
      error: undefined
    };
  })
  .on(effects.updateCustomAgreementServiceDesc.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetUpdateCustomAgreementServiceDesc);


export const $uploadCustomAgreementFile = createStore<UpdateCustomAgreementServiceStoreI>({ loading: false, success: false, agreementId: null, error: undefined })
  .on(effects.uploadCustomAgreementFile, (state, params) => {
    return {
      ...state,
      loading: true,
      agreementId: params.id
    };
  })
  .on(effects.uploadCustomAgreementFile.done, (state) => {
    return {
      ...state,
      loading: false,
      success: true,
      error: undefined
    };
  })
  .on(effects.uploadCustomAgreementFile.fail, (state, response) => {
    return {
      ...state,
      loading: false,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetUploadCustomAgreementFile);


interface QuoteDetailsStoreI extends LoadingI {
  data: any;
}

export const $quoteDetails = createStore<QuoteDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchQuoteDetails.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchQuoteDetails.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchQuoteDetails.fail, (state, response) => ({
    ...state,
    data: null,
    error: response.error.response && response.error.response.data
  }))
  .reset(events.resetAgreementCard);


export const $changeQuoteStatus = createStore({ loading: false, success: false, error: undefined })
  .on(effects.changeQuoteStatus.pending, (state, pending) => {
    return {
      ...state,
      loading: pending,
    };
  })
  .on(effects.changeQuoteStatus.done, (state) => {
    return {
      ...state,
      success: true,
      error: undefined
    };
  })
  .on(effects.changeQuoteStatus.fail, (state, response) => {
    return {
      ...state,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetChangeQuoteStatus);


interface GeneratedQuoteStoreI extends LoadingI {
  data: string | null;
}

export const $generatedQuote = createStore<GeneratedQuoteStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchGeneratedQuote.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchGeneratedQuote.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchGeneratedQuote.fail, (state, response) => ({
    ...state,
    data: null,
    error: response.error.response && response.error.response.data
  }))
  .reset(events.resetAgreementCard);


export const $uploadQuoteFile = createStore({ loading: false, success: false, error: undefined })
  .on(effects.uploadQuoteFile.pending, (state, pending) => {
    return {
      ...state,
      loading: pending,
    };
  })
  .on(effects.uploadQuoteFile.done, (state) => {
    return {
      ...state,
      success: true,
      error: undefined
    };
  })
  .on(effects.uploadQuoteFile.fail, (state, response) => {
    return {
      ...state,
      success: false,
      error: response.error.response && response.error.response.data
    };
  })
  .reset(events.resetUploadQuoteFile);


interface AgreementInvoicesListStoreI extends LoadingI {
  data: PaginationResponse<any>;
}

export const $agreementInvoices = createStore<AgreementInvoicesListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchAgreementInvoices.pending, (state, loading) => ({
    ...state,
    loading
  }))
  .on(effects.fetchAgreementInvoices.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchAgreementInvoices.fail, (state, response) => ({
    ...state,
    data: new PaginationList(),
    error: response.error.response && response.error.response.data
  }))
  .reset(resetClientCard);


export const $generatedInvoicesMap = createStore({})
  .on(effects.fetchGeneratedInvoice, (state, params) => {
    return {
      ...state,
      [params]: {
        loading: true,
        data: null,
        error: null,
      }
    };
  })
  .on(effects.fetchGeneratedInvoice.done, (state, response) => ({
    ...state,
    [response.params]: {
      loading: false,
      data: response.result,
      error: null,
    }
  }))
  .on(effects.fetchGeneratedInvoice.fail, (state, response) => ({
    ...state,
    [response.params]: {
      loading: false,
      data: null,
      error: response.error.response && response.error.response.data,
    }
  }))
  .reset(resetClientCard);

  export const $dataEntry = createStore<QuoteDetailsStoreI>({ loading: false, error: undefined, data: null})
  .on(effects.fetchDataEntryByAgreementId.pending, (state, pending) => {
    return {
      ...state,
      loading: pending,
    };
  })
  .on(effects.fetchDataEntryByAgreementId.done, (state,res) => {
    return {
      ...state,
      data: res.result,
      error: undefined,
      loading: false
    };
  })
  .on(effects.fetchDataEntryByAgreementId.fail, (state, response) => {
    return {
      ...state,
      error: response.error.response && response.error.response.data
    };
  })

  export const $statusUpdate = createStore<LoadingI>({ loading: false, error: undefined})
  .on(effects.updateStatusDataEntry.pending, (state, pending) => {
    return {
      ...state,
      loading: pending,
    };
  })
  .on(effects.updateStatusDataEntry.done, (state) => {
    return {
      ...state,
      error: undefined,
      loading: false
    };
  })
  .on(effects.updateStatusDataEntry
    .fail, (state, response) => {
    return {
      ...state,
      error: response.error.response && response.error.response.data
    };
  })