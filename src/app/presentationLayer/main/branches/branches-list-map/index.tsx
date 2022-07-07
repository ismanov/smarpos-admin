import React, { useEffect } from 'react';
import { useStore } from "effector-react";
import Leaflet from 'leaflet';
import { Map, TileLayer } from 'react-leaflet';
import { Pins } from "./pins";
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import branchesEffector from "app/presentationLayer/effects/branches";

Leaflet.Icon.Default.imagePath = '../node_modules/leaflet';
delete Leaflet.Icon.Default.prototype._getIconUrl;
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export const BranchesListMap = () => {
  const $branchesListMap = useStore(branchesEffector.stores.$branchesListMap);
  const $branchesListFilter = useStore(branchesEffector.stores.$branchesListFilter);

  const { data: tts } = $branchesListMap;

  useEffect(() => {
    branchesEffector.effects.fetchBranchesListMapEffect($branchesListFilter);
  }, [ $branchesListFilter ]);

  const pins = tts.filter((item) => item.latitude && item.longitude);

  return (
    <>
      {/*<div className="total-number-heading m-b-15">Всего: {loading ? "" :tts.length.toLocaleString("ru")}</div>*/}
      <div className="branches__map">
        <Map center={[39.1, 64.906649]} zoom={6} style={{ height: 1000 }}>
          <TileLayer url="https://osm.smartpos.uz/tile/{z}/{x}/{y}.png" />
          {!!pins.length && <Pins pins={pins} />}
        </Map>
      </div>
    </>
  )
};
