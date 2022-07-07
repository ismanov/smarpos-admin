import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import * as clientEvents from "../events";
import { LoadingI, SuccessStoreI } from "app/businessLogicLayer/models";
import {
  TelegramAccountDetailsI,
  TelegramAccountListItemI,
  TelegramAccountsListFilterI
} from "app/businessLogicLayer/models/TelegramAccount";


interface TelegramAccountsListStoreI extends LoadingI {
  data: TelegramAccountListItemI[];
}

export const $telegramAccountsList = createStore<TelegramAccountsListStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.fetchTelegramAccountsList.pending, (state, loading) => ({
    ...state,
    loading
  }))
  .on(effects.fetchTelegramAccountsList.done, (state, response) => ({
    ...state,
    data: response.result,
    error: undefined
  }))
  .on(effects.fetchTelegramAccountsList.fail, (state, response) => {
    return {
      ...state,
      data: [],
      error: response.error.response && response.error.response.data
    };
  })
  .reset(clientEvents.resetClientCard);

export const $telegramAccountsListFilter = createStore<TelegramAccountsListFilterI>({})
  .on(events.updateTelegramAccountsListFilter, (prevStore, props) => ({ ...prevStore, ...props }))
  .reset(events.resetTelegramAccountsListFilter);


export const $createTelegramAccount = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.createTelegramAccount.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createTelegramAccount.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .on(effects.createTelegramAccount.fail, (state, result) => ({
    ...state,
    loading: false,
    success: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetCreateTelegramAccount);


export const $updateTelegramAccount = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.updateTelegramAccount.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateTelegramAccount.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .on(effects.updateTelegramAccount.fail, (state, result) => ({
    ...state,
    loading: false,
    success: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetUpdateTelegramAccount);

export const $deleteTelegramAccount = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.deleteTelegramAccount.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.deleteTelegramAccount.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .on(effects.deleteTelegramAccount.fail, (state, result) => ({
    ...state,
    loading: false,
    success: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetDeleteTelegramAccount);

interface TelegramAccountDetailsStoreI extends LoadingI {
  data: TelegramAccountDetailsI | null;
}

export const $telegramAccountDetails = createStore<TelegramAccountDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.fetchTelegramAccountDetails, (state) => ({
    ...state,
    loading: true
  }))
  .on(effects.fetchTelegramAccountDetails.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result,
    error: undefined
  }))
  .on(effects.fetchTelegramAccountDetails.fail, (state, result) => ({
    ...state,
    loading: false,
    data: null,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetTelegramAccountDetails);

export const $enableTelegramAccount = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.enableTelegramAccount.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.enableTelegramAccount.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .on(effects.enableTelegramAccount.fail, (state, result) => ({
    ...state,
    loading: false,
    success: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetEnableTelegramAccount);

export const $disableTelegramAccount = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.disableTelegramAccount.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.disableTelegramAccount.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .on(effects.disableTelegramAccount.fail, (state, result) => ({
    ...state,
    loading: false,
    success: false,
    error: result.error.response && result.error.response.data
  }))
  .reset(events.resetDisableTelegramAccount);