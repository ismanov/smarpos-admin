import React from "react";
import Card from "app/presentationLayer/components/card";
import {Chart} from "react-google-charts";
import {bindPresenter} from "app/hocs/bindPresenter";
import DashboardPresenter from "app/businessLogicLayer/presenters/DashboardPresenter";
//@ts-ignore
import styles from './dashboard.module.css';

export type DashboardState = { chequesByRegionsForMap?: Array<{ regionCode: string, regionName: string, chequeCount: number, clientCount: number, branchCount: number }> }

export default bindPresenter<DashboardState, DashboardPresenter>(DashboardPresenter, ({model, presenter}) => {
    let data: Array<Array<string | number>> = [['Region', 'Регион', 'Чеки', 'Клиенты']];

    (model.chequesByRegionsForMap || []).forEach(ch => {
        data.push([ch.regionCode, ch.regionName, ch.chequeCount, ch.clientCount])
    });
    return (
        <div className={styles.main}>
            <Card className={styles.content}>
                {data.length === 1 ? false : (
                    <Chart chartType="GeoChart" data={data} width="100%" height="100%" options={{
                        sizeAxis: {minValue: 0, maxValue: 100},
                        is3D: true,
                        region: 'UZ',
                        resolution: 'provinces',
                        colorAxis: {colors: ['#eeeeee', '#009f3c']},
                        backgroundColor: '#fff',
                        datalessRegionColor: '#fff',
                        defaultColor: '#f5f5f5',
                    }} rootProps={{'data-testid': '2'}} legendToggle/>)}
            </Card>
        </div>);
});

