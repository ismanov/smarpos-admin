import { createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import { User } from "app/businessLogicLayer/models/User";
import { fromArrayToObj } from "app/presentationLayer/components/with-permission/helper";
import { AppRouteDetails, AppRouteModel } from "app/businessLogicLayer/models/Permissions";
import { LoadingI, StringMapI, SuccessStoreI } from "app/businessLogicLayer/models";



interface AppRoutesStoreI extends LoadingI {
  data: AppRouteModel[];
}

export const $appRoutes = createStore<AppRoutesStoreI>({ loading: false, data: [], error: undefined })
  .on(effects.getAppRoutesEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getAppRoutesEffect.done, (prevStore, response) => {
    return {
      ...prevStore,
      data: response.result,
      error: undefined
    };
  });

export const $createAppRoute = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.createAppRouteEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.createAppRouteEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetCreateAppRouteEvent);

export const $updateAppRoute = createStore<SuccessStoreI>({ loading: false, success: false, error: undefined })
  .on(effects.updateAppRouteEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.updateAppRouteEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetUpdateAppRouteEvent);

export const $deleteAppRoute = createStore({ loading: false, success: false, error: undefined })
  .on(effects.deleteAppRouteEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.deleteAppRouteEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetDeleteAppRouteEvent);

interface AppRouteDetailsStoreI extends LoadingI {
  data: AppRouteDetails | null;
}

export const $appRouteDetails = createStore<AppRouteDetailsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.getAppRouteDetailsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getAppRouteDetailsEffect.done, (prevStore, response) => {
    return {
      ...prevStore,
      data: response.result,
      error: undefined
    };
  })
  .reset(events.resetAppRouteDetailsEvent);

interface PermissionsModeStoreI {
  user: User | null
  permissions: StringMapI
}

export const $permissionsMode = createStore<PermissionsModeStoreI>({ user: null, permissions: {} })
  .on(events.enablePermissionsMode, (_, payload) => ({
    user: payload,
    permissions: {}
  }))
  .on(effects.getUserPermissionsEffect.done, (prevStore, response) => {
    return {
      ...prevStore,
      permissions: fromArrayToObj(response.result)
    }
  })
  .on(events.selectPermissions, (prevStore, payload) => {
    return {
      ...prevStore,
      permissions: {
        ...prevStore.permissions,
        ...fromArrayToObj(payload)
      }
    }
  })
  .on(events.unSelectPermissions, (prevStore, payload) => {
    const permissions = { ...prevStore.permissions };

    payload.forEach((item) => {
      delete permissions[item]
    });

    return {
      ...prevStore,
      permissions,
    }
  })
  .reset(events.resetPermissionsMode);

interface UserPermissionsStoreI extends LoadingI {
  data: string[] | null;
}

export const $userPermissions = createStore<UserPermissionsStoreI>({ loading: false, data: null, error: undefined })
  .on(effects.getUserPermissionsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.getUserPermissionsEffect.done, (prevStore, response) => {
    return {
      ...prevStore,
      data: response.result,
      error: undefined
    };
  })
  .reset(events.resetUserPermissions);

export const $addPermissions = createStore({ loading: false, success: false, error: undefined })
  .on(effects.addPermissionsEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(effects.addPermissionsEffect.done, (prevStore) => {
    return {
      ...prevStore,
      success: true,
      error: undefined
    };
  })
  .reset(events.resetAddPermissions);