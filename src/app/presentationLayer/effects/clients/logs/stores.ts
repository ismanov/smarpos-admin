import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { LoadingI } from "app/businessLogicLayer/models";
import { Log } from "app/businessLogicLayer/models/Log";
import { resetClientCard } from "app/presentationLayer/effects/clients/events";


// Logs components

interface LogsListStoreI extends LoadingI {
  data: PaginationResponse<Log>;
}

export const $logsList = createStore<LogsListStoreI>({ loading: false, data: new PaginationList(), error: undefined })
  .on(effects.fetchLogsListEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchLogsListEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchLogsListEffect.fail, (state, result) => ({
    ...state,
    loading: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(resetClientCard);

export const $logsFilter = createStore({})
  .on(events.updateLogsFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetLogsFilter)
  .reset(resetClientCard);