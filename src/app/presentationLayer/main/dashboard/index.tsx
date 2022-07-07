import React from "react";
import {bindPresenter} from "app/hocs/bindPresenter";
import DashboardPresenter from "app/businessLogicLayer/presenters/DashboardPresenter";
import RegionsMap from 'app/presentationLayer/main/dashboard/map';
import Loading from "app/presentationLayer/components/loading";
//@ts-ignore
import styles from './dashboard.module.css';
import Card from "app/presentationLayer/components/card";

export type DashboardState = {
    chequesByRegionsForMap?: Array<{
        regionCode: string,
        regionName: string,
        chequeCount: number,
        clientCount: number,
        branchCount: number
    }>
}

export default bindPresenter<DashboardState, DashboardPresenter>(DashboardPresenter, ({model, presenter}) => {

    return (
      <Card>
        <div className={styles.main}>
            {model.chequesByRegionsForMap !== undefined && model.chequesByRegionsForMap.length > 0 ? (
                <RegionsMap
                    regions={model.chequesByRegionsForMap}
                />
            ) : (
                <div className={'loading-wrapper'}>
                    <Loading show={true}/>
                </div>
            )}
        </div>
      </Card>
    );
});
