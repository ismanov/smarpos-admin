import React from 'react';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Marker, Popup } from "react-leaflet";
import 'react-leaflet-markercluster/dist/styles.min.css';
import './map-widget.scss';

const hexToRgb = (hex, opacity) => {
  if (!hex.startsWith('#')) return hex;
  const hashless = hex.slice(1);
  const num = parseInt(
    hashless.length === 3
      ? hashless.split('').map(c => c.repeat(2)).join('')
      : hashless,
    16,
  );
  const red = num >> 16;
  const green = (num >> 8) & 255;
  const blue = num & 255;

  if (opacity) {
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }
  return `rgb(${red}, ${green}, ${blue})`;
};

export const Pins = (props) => {
  const { pins } = props;

  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();
    let size = 'LargeXL';

    if (count < 10) {
      size = 'Small';
    }
    else if (count >= 10 && count < 100) {
      size = 'Medium';
    }
    else if (count >= 100 && count < 500) {
      size = 'Large';
    }
    const options = {
      cluster: `markerCluster${size}`,
      circle1: `markerCluster${size}DivOne`,
      circle2: `markerCluster${size}DivTwo`,
      circle3: `markerCluster${size}DivThree`,
      circle4: `markerCluster${size}DivFour`,
      label: `markerCluster${size}Label`,
    };

    // @ts-ignore
    const clusterColor = hexToRgb('#0170fe');
    const circleStyle1 = `background-color: ${clusterColor.slice(0, -1)}, 0.05)`;
    const circleStyle2 = `background-color: ${clusterColor.slice(0, -1)}, 0.15)`;
    const circleStyle3 = `background-color: ${clusterColor.slice(0, -1)}, 0.25)`;
    const circleStyle4 = `background-color: ${clusterColor.slice(0, -1)}, 0.65)`;


    return L.divIcon({
      html:
        `<div style="${circleStyle1}" class="${options.circle1}">
					<div style="${circleStyle2}" class="${options.circle2}">
						<div style="${circleStyle3}" class="${options.circle3}">
							<div style="${circleStyle4}" class="${options.circle4}">
								<span class="${options.label}">${count}</span>
							</div>
						</div>
					</div>
				</div>`,
      className: `${options.cluster}`,
    });
  };

  return (
    <MarkerClusterGroup
      iconCreateFunction={createClusterCustomIcon}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom={true}
      spiderLegPolylineOptions={{ weight: 0, opacity: 0 }}
      removeOutsideVisibleBounds={true}
    >
      {pins.map((pin) => (
        <Marker key={pin.id} position={[pin.latitude, pin.longitude]}>
          <Popup>
            ТТ: {pin.name} <br />
            Клиент: {pin.customer} <br />
            ИНН: {pin.tin} <br />
            Телефон: {pin.phone} <br />
            Сф. дея-ти: {pin.activityType}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};