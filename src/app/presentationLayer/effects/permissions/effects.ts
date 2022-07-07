import { createEffect } from "effector";
import { AxiosError } from "axios";
import Repository from "app/businessLogicLayer/repo";
import { AddPermissionsModel, AppRouteModel, CreateAppRouteModel } from "app/businessLogicLayer/models/Permissions";


export const getAppRoutesEffect = createEffect<object, AppRouteModel[], AxiosError>({
  handler: Repository.permissions.getAppRoutes
});

export const createAppRouteEffect = createEffect<CreateAppRouteModel, any, AxiosError>({
  handler: Repository.permissions.createAppRoute
});

export const updateAppRouteEffect = createEffect<CreateAppRouteModel, any, AxiosError>({
  handler: Repository.permissions.updateAppRoute
});

export const deleteAppRouteEffect = createEffect<number, any, AxiosError>({
  handler: Repository.permissions.deleteAppRoute
});

export const getAppRouteDetailsEffect = createEffect<number, any, AxiosError>({
  handler: Repository.permissions.getAppRouteDetails
});

export const getUserPermissionsEffect = createEffect<number, any, AxiosError>({
  handler: Repository.permissions.getUserPermissions
});

export const addPermissionsEffect = createEffect<AddPermissionsModel, any, AxiosError>({
  handler: Repository.permissions.addPermissions
});