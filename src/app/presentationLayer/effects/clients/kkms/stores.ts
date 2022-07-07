import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { LoadingI } from "app/businessLogicLayer/models";
import { KKM } from "app/businessLogicLayer/models/KKM";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";


// Kkms components

interface KkmsListStoreI extends LoadingI {
  data: PaginationResponse<KKM>;
}

export const $kkmsList = createStore<KkmsListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchKkmsListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchKkmsListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchKkmsListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(resetClientCard);

export const $kkmsFilter = createStore({})
  .on(events.updateKkmsFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetKkmsFilter)
  .reset(resetClientCard);