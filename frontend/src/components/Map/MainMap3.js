import React, {useState, Fragment, useCallback, useEffect, useRef  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Map, MapContainer, TileLayer, Marker, Popup, FeatureGroup, MapConsumer } from 'react-leaflet';
import "leaflet-draw/dist/leaflet.draw-src.css"; 
import { EditControl } from "react-leaflet-draw";
import { Fab, Grid } from '@material-ui/core';
import GestureTwoToneIcon from '@material-ui/icons/GestureTwoTone';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {FaMapMarkerAlt } from 'react-icons/fa'
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers/dist/js/leaflet.extra-markers.js";


import {useLeafletContext} from '@react-leaflet/core';
import L, { map } from 'leaflet';
import RoutingMachine from './Route';
import VehicleDialogWindow from './custom/VehicleDialog'


import MapDrawFeature from './custom/MapDrawFeature';




export default function MainMap(props) {
  const [mapState, setMapState] = React.useState('idle');


  const CENTER = { lat: -9.94667512, lng: -54.924356 }
  const ZOOM_LEVEL = 5;

  return (
    <div style={{height:'90%', width:'100%', minHeight: '100%', minWidth: '100%'}}>
      <MapContainer center={CENTER} zoom={ZOOM_LEVEL} scrollWheelZoom={true}>
       
        <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapDrawFeature/>

      </MapContainer>
    </div>
  
  );  

}







