import React, {useEffect, useState} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_region_uzbekistan from "@amcharts/amcharts4-geodata/uzbekistanHigh";

const MapRegionsView = (props) => {
    let chart;
    let [mode, setMode] = useState('branchCount');

    useEffect(() => {
        // Create map instance
        chart = am4core.create("chartdiv", am4maps.MapChart);
        chart.logo.disabled = true;
        // Set map definition
        chart.geodata = am4geodata_region_uzbekistan;
        // Set projection
        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series
        let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        // Configure series
        let polygonTemplate = polygonSeries.mapPolygons.template;

        let strToShow = '';
        if (mode === 'branchCount') {
            strToShow = "Торговые точки: {branchCount}";
        } else {
            strToShow = "Клиенты: {clientCount}"
        }
        polygonTemplate.tooltipText = `[bold]{regionName}[/]
		----
		${strToShow}
		Чеки: {chequeCount}
		`;

        polygonSeries.tooltip.getFillFromObject = false;
        polygonSeries.tooltip.background.fill = am4core.color("#fff");
        polygonSeries.tooltip.label.fill = am4core.color("#00");

        polygonTemplate.fill = am4core.color("#009f3c");

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#98A9BC");

        polygonSeries.exclude = ["TJ-SU", "UZ-TK"];

        // Add heat rule
        polygonSeries.heatRules.push({
            "property": "fill",
            "target": polygonSeries.mapPolygons.template,
            "min": am4core.color("#ccc"),
            "max": am4core.color("#009f3c")
        });
        let dataMap = [];
        if (props.regions.length) {
            dataMap = props.regions.map((region) => {
                return {
                    id: region.regionCode,
                    [mode]: region[mode],
                    chequeCount: region.chequeCount,
                    regionCode: region.regionCode,
                    regionName: region.regionName,
                    value: region[mode]
                };
            });
        }

        polygonSeries.data = dataMap;

        return () => {
            if (chart) {
                chart.dispose();
            }
        }

    }, [props.regions, mode]);


    return (
        <>
            <div className="chart-cm-buttons">
                <form action="" onSubmit={(e) => {
                    e.preventDefault()
                }}>
                    <label htmlFor="branches" className={'radio-item'}>
                        Торговые точки
                        <input id={'branches'} type="radio" name={'type'} value={'branchCount'} onChange={(e) => {
                            setMode(e.target.value)
                        }} checked={mode === 'branchCount'}/>
                        <span className="checkmark"></span>
                    </label>
                    <label htmlFor="clients" className={'radio-item'}>
                        Клиенты
                        <input id={'clients'} type="radio" name={'type'} value={'clientCount'} onChange={(e) => {
                            setMode(e.target.value)
                        }} checked={mode === 'clientCount'}/>
                        <span className="checkmark"></span>
                    </label>
                </form>
            </div>
            <div id="chartdiv" style={{width: "100%", height: "600px"}}/>
        </>
    )
};

export default MapRegionsView;
