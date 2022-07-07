import { BusinessType } from "app/businessLogicLayer/models/BusinessType";
import instance from "app/businessLogicLayer/config/api";
import { ActivityType } from "app/businessLogicLayer/models/AcitivityType";
import {City} from "app/businessLogicLayer/models/City";
import {Region} from "app/businessLogicLayer/models/Region";
import { Role } from "app/businessLogicLayer/models/Role";

interface ResourcesRepo {
  fetchBusinessTypes(): Promise<Array<BusinessType>>;
  fetchActivityTypes(): Promise<Array<ActivityType>>;
  fetchCityListForRegionId(regionId: number): Promise<Array<City>>
  fetchRegionList(): Promise<Array<Region>>
}

export default class ResourcesRepoImpl implements ResourcesRepo {
  fetchBusinessTypes(): Promise<Array<BusinessType>> {
    return instance.httpGet<Array<BusinessType>>("/api/company/business-types");
  }
  fetchActivityTypes(): Promise<Array<ActivityType>> {
    return instance.httpGet<Array<ActivityType>>("/api/activity-types");
  }
  sendSms(data:any): Promise<any> {
    return instance.httpPost<any>("/api/activity-types",data);
  }
  fetchCityListForRegionId(regionId: number): Promise<Array<City>> {
    return instance.httpGet<Array<City>>(`/api/cities/${regionId}`);
  }
  fetchRegionList(): Promise<Array<Region>> {
    return instance.httpGet<Array<Region>>('/api/regions');
  }
  fetchUsersRoles(): Promise<Array<Role>> {
    return instance.httpGet<Array<Role>>('/api/admin/users/roles');
  }

  createAndUpdateTerminal(data:any): Promise<any> {
    return instance[data.method === 'POST'? 'httpPost' : 'httpPut']<any>("/api/admin/terminals",data.data);
  }
}
