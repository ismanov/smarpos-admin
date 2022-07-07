import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class Network {
  readonly instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {    
    this.instance = axios.create({
      ...config,
      timeout: config && config.timeout !== undefined ? config.timeout : 30000
    });
  }

  addRequestInterceptor(
    onFullFilled?: (
      config: AxiosRequestConfig
    ) => Promise<AxiosRequestConfig> | AxiosRequestConfig,
    onReject?: (error: any) => any
  ) {
    if (!onFullFilled && !onReject) return;
    this.instance.interceptors.request.use(onFullFilled, onReject);
  }

  addResponseInterceptor(
    onFullFilled?: (
      config: AxiosResponse
    ) => Promise<AxiosResponse> | AxiosResponse,
    onReject?: (error: any) => any
  ) {
    if (!onFullFilled && !onReject) return;
    this.instance.interceptors.response.use(onFullFilled, onReject);
  }

  makeQueryParams(filter?: any): string {
    if (!filter || Object.keys(filter).length === 0) {
      return "";
    }
    return (Object.keys(filter)
      .filter(item => filter[item] !== undefined) || [])
      .reduce(
        (acc, key) => acc + `${acc ? "&" : "?"}${key}=${filter[key]}`,
        ""
      );
  }

  httpGet<T>(
    url: string,
    queryParams?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return new Promise<T>((res, rej) => {
      let u = `${url}${queryParams ? this.makeQueryParams(queryParams) : ""}`;
      this.instance
        .get(u, config)
        .then(response => res(response.data))
        .catch(error => rej(error));
    });
  }

  httpPost<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return new Promise<T>((res, rej) => {
      this.instance
        .post(
          url,
          data,
          config || { headers: { "Content-Type": "application/json" } }
        )
        .then(response => res(response.data))
        .catch(error => rej(error));
    });
  }

  httpPostResponse<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>>((res, rej) => {
      this.instance
        .post(
          url,
          data,
          config || { headers: { "Content-Type": "application/json" } }
        )
        .then(response => res(response))
        .catch(error => rej(error));
    });
  }

  httpPut<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return new Promise<T>((res, rej) => {
      this.instance
        .put(url, data, config)
        .then(response => res(response.data))
        .catch(error => rej(error));
    });
  }

  httpDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return new Promise<T>((res, rej) => {
      this.instance
        .delete(url, config)
        .then(response => res(response.data))
        .catch(error => rej(error));
    });
  }
}
