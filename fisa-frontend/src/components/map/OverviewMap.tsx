/* eslint-disable react/require-default-props */
import React, { createRef } from 'react';
import L from 'leaflet';
import { Button, Typography, makeStyles } from '@material-ui/core';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  Viewport,
  Polygon,
} from 'react-leaflet';
import Search from 'react-leaflet-search';
import 'leaflet/dist/leaflet.css';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import Control from 'react-leaflet-control';

import { useTranslation } from 'react-i18next';
import { CardPositionI, PointI, PolygonI } from '../../redux/interfaces';

const activePolygonColor = '#cb293c';
const activePosIcon = getLeafletIcon('marker-icon-2x-red.png');
const inactivePosIcon = getLeafletIcon('marker-icon-2x-blue.png');
const polyPositionIcon = getLeafletIcon('marker-icon-2x-green.png');
const startPolygonIcon = getLeafletIcon('marker-icon-2x-black.png');

function getLeafletIcon(iconName: string): L.Icon {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/${iconName}`,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -4],
  });
}

const style = makeStyles(() => ({
  locateButton: {
    color: '#000',
    backgroundColor: '#fff',
    padding: 2,
    margin: 0,
    minWidth: 0,
    border: 'solid 1px',
    borderColor: '#888',
  },
}));

interface OverviewMapProps {
  latLng: PointI | undefined;
  polyLatLng: PolygonI | undefined;
  setLatLng: (newVal: PointI) => void | undefined;
  setPolyLatLng: (newVal: PolygonI) => void | undefined;
  otherPositions: CardPositionI[];
}

export default function OverviewMap(props: OverviewMapProps) {
  const { t } = useTranslation('map');
  const classes = style();

  const [viewport, setViewport] = React.useState<Viewport>({
    center: props.latLng
      ? props.latLng
      : (props.polyLatLng && props.polyLatLng[0]) || [50.102, 8.6478],
    zoom: 13,
  });

  const [mapRef] = React.useState(createRef<Map>());

  const updatePolygon = (updateIndex: number, newPosition: L.LatLng) => {
    if (props.setPolyLatLng && props.polyLatLng) {
      const newPol = props.polyLatLng;
      newPol[updateIndex] = [newPosition.lat, newPosition.lng];
      props.setPolyLatLng([...newPol]);
    }
  };

  const removePolygonIndex = (index: number) => {
    if (props.setPolyLatLng && props.polyLatLng) {
      const newPol = props.polyLatLng;
      newPol.splice(index, 1);
      props.setPolyLatLng([...newPol]);
    }
  };

  const setPolygonIndexActive = (index: number) => {
    if (props.setPolyLatLng && props.polyLatLng) {
      const newPol = props.polyLatLng;
      const newStart = newPol.splice(index, newPol.length - index);
      props.setPolyLatLng([...newStart, ...newPol]);
    }
  };

  const handleClick = (e: L.LeafletMouseEvent) => {
    if (props.setPolyLatLng && props.polyLatLng) {
      props.setPolyLatLng([...props.polyLatLng, [e.latlng.lat, e.latlng.lng]]);
    } else if (props.latLng && props.setLatLng) {
      setLocation(e.latlng);
    }
  };

  const setLocation = (newLatLng: L.LatLng) => {
    if (props.latLng) {
      props.setLatLng([newLatLng.lat, newLatLng.lng]);
    }
  };

  const handleLocationFound = (e: L.LocationEvent) => {
    setViewport((oldViewport) => ({
      ...oldViewport,
      center: [e.latlng.lat, e.latlng.lng],
    }));

    setLocation(e.latlng);
  };

  const setBaseLocation = () => {
    const map = mapRef.current;
    if (map !== null) {
      map.leafletElement.locate();
    }
  };

  return (
    <Map
      onclick={handleClick}
      center={props.latLng}
      viewport={viewport}
      style={{ height: '100%', padding: 'auto' }}
      onViewportChanged={(e) => setViewport(e)}
      onlocationfound={handleLocationFound}
      ref={mapRef}
    >
      <Control position="topleft">
        <Button
          onClick={setBaseLocation}
          size="small"
          className={classes.locateButton}
        >
          <MyLocationIcon />
        </Button>
      </Control>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.otherPositions.map((pos) => {
        if (pos.isPolygon) {
          return (
            <Polygon positions={pos.position as PolygonI}>
              <Popup>{pos.name}</Popup>
            </Polygon>
          );
        }
        return (
          <Marker
            position={pos.position as PointI}
            key={pos.name}
            icon={inactivePosIcon}
          >
            <Popup>{pos.name}</Popup>
          </Marker>
        );
      })}

      {props.latLng && (
        <Marker
          draggable={true}
          ondragend={(e) => setLocation(e.target.getLatLng())}
          position={props.latLng}
          icon={activePosIcon}
        >
          <Popup>{t('userLocationSign')}</Popup>
        </Marker>
      )}

      {props.polyLatLng && (
        <>
          <Polygon positions={props.polyLatLng} color={activePolygonColor} />
          {props.polyLatLng.map((pol: PointI, index: number) => {
            let icon = index === 0 ? startPolygonIcon : polyPositionIcon;

            // @ts-ignore (it cant be undefined!)
            icon = index === props.polyLatLng.length - 1 ? activePosIcon : icon;
            return (
              <Marker
                draggable={true}
                ondragend={(e) => updatePolygon(index, e.target.getLatLng())}
                position={pol}
                key={`I:${Math.random().toString(15)}`}
                icon={icon}
              >
                <Popup>
                  <Typography style={{ margin: 'auto' }}>
                    Marker {index}
                  </Typography>
                  {index !== 0 && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => setPolygonIndexActive(index)}
                    >
                      Set as active
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => removePolygonIndex(index)}
                  >
                    remove
                  </Button>
                </Popup>
              </Marker>
            );
          })}
        </>
      )}

      <Search position="topleft" zoom={20} showMarker={false} />
    </Map>
  );
}
