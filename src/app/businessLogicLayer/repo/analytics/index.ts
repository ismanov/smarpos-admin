import instance from "app/businessLogicLayer/config/api";
import { MapAnalytics } from "app/businessLogicLayer/models/MapAnalytics";

interface AnalyticsRepo {
    fetchChequesByRegions(): Promise<Array<MapAnalytics>>
}

export default class AnalyticsRepoImpl implements AnalyticsRepo {
    fetchChequesByRegions(): Promise<Array<MapAnalytics>> {
        return instance.httpGet<Array<MapAnalytics>>('/api/analytics/sales-stats/map');
    }
}

