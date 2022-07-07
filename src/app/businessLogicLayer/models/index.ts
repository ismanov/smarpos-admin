import { ResponseErrorDataI } from "app/businessLogicLayer/models/Error";

export interface LoadingI {
  loading: boolean;
  error: ResponseErrorDataI | undefined;
}

export interface SuccessStoreI extends LoadingI {
  success: boolean;
}

export interface StringMapI {
  [key: string]: string;
}