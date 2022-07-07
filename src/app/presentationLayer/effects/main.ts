import { createEffect, createStore } from 'effector';
import Repository from "app/businessLogicLayer/repo";
import { LoadingData } from "app/presentationLayer/effects/types";
import { User } from "app/businessLogicLayer/models/User";
import { fromArrayToObj } from "app/presentationLayer/components/with-permission/helper";

interface currentUserType extends LoadingData {
  data: User | null
}

const getCurrentUserEffect = createEffect<object, User, Error>({
  handler:  Repository.auth.fetchCurrentUser
});

const $currentUser = createStore<currentUserType>({ loading: false, data: null, error: undefined })
  .on(getCurrentUserEffect.pending, (prevStore, pending) => {
    return {
      ...prevStore,
      loading: pending,
    };
  })
  .on(getCurrentUserEffect.done, (state, response) => {
    return {
      ...state,
      data: {
        ...response.result,
        permissions: fromArrayToObj(response.result.permissions),
      }
    }
  });

export default {
  stores: {
    $currentUser
  },
  effects: {
    getCurrentUserEffect
  },
}