import { createEffect, createStore, createApi } from 'effector';
import {Listing} from "app/presentationLayer/effects/Listing";
import Repository from "app/businessLogicLayer/repo";
import {PaginationResponse} from "app/businessLogicLayer/models/PaginationResponse";
import {Log} from "app/businessLogicLayer/models/Log";
import {PagingFilter} from "app/businessLogicLayer/models/PagingFilter";

const clientsStore = createStore<Listing<Log>>({
    page: 0,
    totalPages: 0,
    totalElements: 0,
    list: []
});


const fetchLogEffect = createEffect<PagingFilter, PaginationResponse<Log>, Error>().use(async params => {
    return await Repository.log.fetchLog(params)
});

clientsStore
    .on(fetchLogEffect.done, (state, result) => ({
        ...state,
        list: result.result.content,
        size: result.result.size,
        page: result.result.number,
        totalPages: result.result.totalPages,
        totalElements: result.result.totalElements
    }));

const api = createApi(clientsStore, {
    setData: (state, data: Listing<Log>) => ({...state, ...data})
});

export default {
    store: clientsStore,
    api,
    effects: {
        fetchLog: fetchLogEffect
    },
    queryParams: (params: Listing<Log>) => ({
        page: params.page,
        size: params.size
    })
}
