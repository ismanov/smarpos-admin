import { createEvent } from "effector";

export const resetCreateAppRouteEvent = createEvent();
export const resetUpdateAppRouteEvent = createEvent();
export const resetDeleteAppRouteEvent = createEvent();
export const resetAppRouteDetailsEvent = createEvent();

export const enablePermissionsMode = createEvent<any>();
export const selectPermissions = createEvent();
export const unSelectPermissions = createEvent<any>();
export const resetPermissionsMode = createEvent();

export const resetUserPermissions = createEvent();
export const resetAddPermissions = createEvent();