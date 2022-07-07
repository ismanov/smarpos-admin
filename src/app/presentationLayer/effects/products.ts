import { createEffect, createStore, createEvent } from 'effector';
import Repository from "app/businessLogicLayer/repo";
import { MonitoringProduct } from "app/businessLogicLayer/models/Product";
import { Region } from "app/businessLogicLayer/models/Region";
import { PaginationList, PaginationResponse } from "app/businessLogicLayer/models/PaginationResponse";
import { City } from "app/businessLogicLayer/models/City";
import axios, { CancelTokenSource } from "axios";

interface ILoading {
  loading: boolean;
  error: any;
}

interface IProductsStore extends ILoading {
  data: PaginationResponse<MonitoringProduct>
}

interface IRegionsStore extends ILoading {
  data: Region[];
}

interface ICitiesStore extends ILoading {
  data: City[];
}

interface IProductsFilter {
  from?: string;
  to?: string;
  regionId?: number;
  cityId?: number;
  search?: string;
  inn?: string;
  productName?: string;
  clientName?: string;
  categoryName?: string;
  page?: number;
  size?: number;
  orderBy?: string;
  sortOrder?: string;
}

let productsCancelToken: CancelTokenSource = axios.CancelToken.source();

const fetchProductsEffect = createEffect<IProductsFilter, PaginationResponse<MonitoringProduct>, Error>().use(async params => {
  productsCancelToken && productsCancelToken.cancel('Поиск Чека отменен! Отправляется новый запрос!');
  productsCancelToken = axios.CancelToken.source();
  return await Repository.product.fetchMonitoringProducts(params, productsCancelToken.token);
});

const fetchRegionListEffect = createEffect<void, Region[], Error>().use(async () => {
  return await Repository.resources.fetchRegionList()
});

const fetchCityListEffect = createEffect<number, Array<City>, Error>().use(async regionId => {
  return await Repository.resources.fetchCityListForRegionId(regionId);
});

const updateProductsFilter = createEvent<IProductsFilter>();
const resetCityList = createEvent();

const $products = createStore<IProductsStore>({ loading: false, data: new PaginationList(), error: undefined })
  .on(fetchProductsEffect, (state) => ({
    ...state,
    loading: true
  }))
  .on(fetchProductsEffect.done, (state, result) => ({
    ...state,
    loading: false,
    data: result.result
  }));

const $productsFilter = createStore<IProductsFilter>({})
  .on(updateProductsFilter, (state, filter) => ({ ...state, ...filter }));

const $regions = createStore<IRegionsStore>({ loading: false, data: [], error: undefined })
  .on(fetchRegionListEffect.done, (state, result) => ({
    ...state,
    data: result.result
  }));

const $cities = createStore<ICitiesStore>({ loading: false, data: [], error: undefined })
  .on(fetchCityListEffect.done, (state, result) => ({
    ...state,
    data: result.result
  }))
  .reset(resetCityList);

export default {
  store: {
    $products,
    $productsFilter,
    $regions,
    $cities,
  },
  effects: {
    fetchProducts: fetchProductsEffect,
    fetchRegionList: fetchRegionListEffect,
    fetchCityList: fetchCityListEffect,
  },
  events: {
    updateProductsFilter,
    resetCityList,
  },
}
