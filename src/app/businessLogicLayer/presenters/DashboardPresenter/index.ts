import {BasePresenter} from "app/coreLayer/presenter";
import Repository from "app/businessLogicLayer/repo";
import {DashboardState} from "app/presentationLayer/main/dashboard";
import { groupBy } from "app/utils/utils";
import { RegionCodesForMap } from "app/utils/utils";
import {MapAnalytics} from "app/businessLogicLayer/models/MapAnalytics";

export default class DashboardPresenter extends BasePresenter<DashboardState> {

    mount() {
        this.updateCheques()
    }

    updateCheques() {
        Repository
            .analytics
            .fetchChequesByRegions()
            .then(list => {
                let result: {[key: number]: Array<MapAnalytics>} = groupBy('regionCode', list);
                let chequesForRegions = [
                    'UZ-TO', 'UZ-AN', 'UZ-SA', 'UZ-BU', 'UZ-FA', 'UZ-JI',
                    'UZ-NG', 'UZ-NW', 'UZ-QA', 'UZ-SI', 'UZ-SU', 'UZ-XO', 'UZ-QR'
                ].map(code => {
                    let regionCode = code;
                    let regionName = 'Some Region';
                    let chequeCount = 0;
                    let clientCount = 0;
                    let branchCount = 0;
                    if (code === 'UZ-TO') {
                        result['26'].forEach(a => {
                            chequeCount += a.receiptCount || 0;
                            clientCount += a.companyCount || 0;
                            branchCount += a.branchCount || 0;
                        });
                        result['27'].forEach(a => {
                            chequeCount += a.receiptCount || 0;
                            clientCount += a.companyCount || 0;
                            branchCount += a.branchCount || 0;
                            regionName = a.regionName || '';
                        });
                    } else {
                        (result[RegionCodesForMap[code]] || []).forEach(a => {
                            chequeCount += a.receiptCount || 0;
                            clientCount += a.companyCount || 0;
                            branchCount += a.branchCount || 0;
                            regionName = a.regionName || '';
                        });
                    }
                    return {
                        regionCode,
                        regionName,
                        chequeCount,
                        clientCount,
                        branchCount
                    }
                });
                this.updateModel && this.updateModel({
                    chequesByRegionsForMap: chequesForRegions
                })
            })
    }

}
