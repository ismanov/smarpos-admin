import { FullName } from "app/businessLogicLayer/models/FullName";
import { City } from "app/businessLogicLayer/models/City";
import { Region } from "app/businessLogicLayer/models/Region";

export interface User {
  blocked: boolean;
  branchId: string;
  branchName: string;
  createdById: number;
  createdDateTime: string;
  createdDate: string;
  dismissalDate: string;
  dismissalReason: string;
  dismissed: boolean;
  email: string;
  fullName: FullName;
  fullTime: boolean;
  id: number;
  inn: string;
  lang: string;
  login: string;
  livingAddress: string;
  livingCity: City;
  livingRegion: Region;
  passportNo: string;
  phone: string;
  probationEnd: string;
  registrationAddress: string;
  registrationCity: City;
  registrationRegion: Region;
  authorities: String[];
  salary: string;
  salaryDescription: string;
  startDate: string;
  updatedById: number;
  updatedDateTime: string;
  resetKey: string;
  activationKey: string;
  companyId:string;
  companyName:string;
  permissions: string[];
  superAdmin: boolean;
  telegramLogin: string
  telegramName: string
}

export interface UsersListFilterI {
  companyId?: number;
  branchId?: number;
  roles?: string[];
  search?: string;
  from?: string;
  to?: string;
  orderBy?: string;
  page?: number
  size?: number
}

export interface FetchUsersListParamsType extends UsersListFilterI {}

interface FullNameI {
  firstName?: string;
  lastName?: string;
  patronymic?: string;
}

export interface CreateUserModel {
  id?: number;
  fullName?: FullNameI;
  login?: string;
  password?: string;
}

export interface FetchUsersItemsI {
  companyId: number;
  branchId: number;
}
