import instance from "app/businessLogicLayer/config/api";
import { AddPermissionsModel, AppRouteModel, CreateAppRouteModel } from "app/businessLogicLayer/models/Permissions";

export default class PermissionsRepoImpl {
	getAppRoutes(params: object): Promise<AppRouteModel[]> {
		return instance.httpGet<AppRouteModel[]>("/api/applicationRoute/get-all", params);
	}

	createAppRoute(data: CreateAppRouteModel): Promise<any> {
		return instance.httpPost<any>("/api/applicationRoute", data);
	}

	updateAppRoute(data: CreateAppRouteModel): Promise<any> {
		return instance.httpPut<any>("/api/applicationRoute", data);
	}

	deleteAppRoute(id: number): Promise<any> {
		return instance.httpDelete<any>(`/api/applicationRoute/${id}`);
	}

	getAppRouteDetails(id: number): Promise<any> {
		return instance.httpGet<any>(`/api/applicationRoute/${id}`);
	}

	getUserPermissions(id: number): Promise<string[]> {
		return instance.httpGet<string[]>(`/api/${id}/permissions`);
	}

	addPermissions(data: AddPermissionsModel): Promise<any> {
		return instance.httpPost<any>("/api/permissions", data);
	}
}
