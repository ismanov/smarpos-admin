import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { Cheque, ChequesByBranchStats, ChequesListFilterI, ChequeStatusI } from "app/businessLogicLayer/models/Cheque";
import { ResponseErrorDataI } from "app/businessLogicLayer/models/Error";
import moment from "moment";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";
import { LoadingI } from "app/businessLogicLayer/models";


interface ChequesStatusesStoreI extends LoadingI {
  data: ChequeStatusI[];
}

export const $chequesStatuses = createStore<ChequesStatusesStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchChequesStatuses.pending, (state, pending) => ({
    ...state,
    loading: pending
  }))
  .on(effects.fetchChequesStatuses.done, (state, result) => ({
    ...state,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchChequesStatuses.fail, (state, result) => ({
    ...state,
    data: [],
    error: result.error.response && result.error.response.data
  }));


interface ChequesListStoreI {
  loading: boolean;
  data: PaginationResponse<Cheque>;
  error: ResponseErrorDataI | undefined;
}

export const $chequesList = createStore<ChequesListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchChequesListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequesListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(resetClientCard);

export const $chequesListFilter = createStore<ChequesListFilterI>({
  from: moment().startOf("month").format("YYYY-MM-DD HH:mm"),
  to: moment().endOf("day").format("YYYY-MM-DD HH:mm"),
  es: true
})
  .on(events.updateChequesListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetChequesListFilter)
  .reset(resetClientCard);


interface ChequeStatisticsType {
  loading: boolean;
  data: ChequesByBranchStats | null;
  error: ResponseErrorDataI | undefined;
}

export const $chequesStats = createStore<ChequeStatisticsType>({ loading: false, data: null, error: undefined })
  .on(effects.fetchChequesStatsEffect, (state) => ({
    ...state,
    loading: true

  }))
  .on(effects.fetchChequesStatsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetChequeStatisticsEvent);


interface ChequeDetailsType {
  loading: boolean;
  data: Cheque | null;
  error: ResponseErrorDataI | undefined;
}

export const $chequeDetails = createStore<ChequeDetailsType>({ loading: false, data: null, error: undefined })
  .on(effects.fetchChequeDetailsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchChequeDetailsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }))
  .reset(events.resetChequeDetailsEvent);