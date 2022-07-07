import instance from "app/businessLogicLayer/config/api";
import { FetchLogsListParamsType, Log } from "app/businessLogicLayer/models/Log";
import {PaginationResponse} from "app/businessLogicLayer/models/PaginationResponse";

interface LogRepo {
    // fetchLog(filter: PagingFilter): Promise<PaginationResponse<Log>>
}

export default class LogRepoImpl implements LogRepo {
    fetchLog(params: FetchLogsListParamsType): Promise<PaginationResponse<Log>> {
        return instance.httpGet<PaginationResponse<Log>>("/api/admin/audit/logs", params);
    }
}
