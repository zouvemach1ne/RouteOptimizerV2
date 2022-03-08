import L, { map } from 'leaflet';
import React, {useState, useCallback, useEffect, useRef  } from 'react';
import { Map, MapContainer, TileLayer, Marker, Popup, FeatureGroup, MapConsumer } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";


export default function MapDrawFeature(props) {

  const layerColor = '#ff0000'
  const defaultColor = '#4262ff'

  const customDraw= { 
    polyline:false,
    polygon:{shapeOptions: {color:layerColor, clickable: true, }}, 
    rectangle:false, 
    circle:false, 
    circlemarker:false,
  };

  const _onCreated = (e) => {
    console.log('creating')
    console.log(e)
    // const { layerType, layer } = e;
    // if (layerType === "polygon") {
    //   layer.on({click: handleLayerClick})//`<div class="leaflet-popup-content-wrapper"><div class="leaflet-popup-content" style="width: 197px;"><div class="MuiFormControl-root makeStyles-formControl-51"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated" data-shrink="false" id="vehicle-selector-label">Equipe</label><div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"><div class="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input" tabindex="0" role="button" aria-haspopup="listbox" aria-labelledby="vehicle-selector-label vehicle-selector" id="vehicle-selector"><span>​</span></div><input aria-hidden="true" tabindex="-1" class="MuiSelect-nativeInput" value=""><svg class="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div><p class="MuiFormHelperText-root">Escolha a equipe para esta rota</p></div></div></div>`)//'<div class="MuiFormControl-root makeStyles-formControl-28"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated" data-shrink="false" id="vehicle-selector-label">Equipe</label><div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"><div class="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input" tabindex="0" role="button" aria-haspopup="listbox" aria-labelledby="vehicle-selector-label vehicle-selector" id="vehicle-selector" style=""><span>​</span></div><input aria-hidden="true" tabindex="-1" class="MuiSelect-nativeInput" value=""><svg class="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div><p class="MuiFormHelperText-root">Escolha a equipe para esta rota</p></div>')
    //   const { _leaflet_id } = layer;
    //   console.log('leaflet id = ' + _leaflet_id)
    //   var new_layer = {
    //     id: _leaflet_id, 
    //     latlngs: layer.getLatLngs()[0], 
    //     color: layerColor, 
    //     vehicle: '',
    //     services: [],
    //     route: null,
    //     routeDraw: null
    //   }
    //   setMapLayers(layers => 
    //     [...layers, 
    //       {...new_layer, services:checkInvolvedMarkers(new_layer)}
    //     ]);
      
    // }
    // console.log(loading)
    // setLayerColor(randomColor())
  };

  const _onEdited = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map( (l) => 
          l.id === _leaflet_id 
          ? { ...l, latlngs: editing.latlngs[0][0], services:checkInvolvedMarkers({...l, latlngs: editing.latlngs[0][0]})  }
          : l
        )
      );



    });
  };
  
  const _onDeleted = (e) => {
    console.log('deleting')
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };
  
  const _onDrawStart = (e) => {
    console.log(e)
  };
  
  return(
    <FeatureGroup>
      <EditControl 
        onCreated={_onCreated} 
        onEdited={_onEdited} 
        onDeleted={_onDeleted} 
        onDrawStart={_onDrawStart}
        position="topright"                  
        draw={customDraw} 
      />
      { (L.drawLocal.draw.toolbar.buttons.polygon = "draw") }
      
    </FeatureGroup>
  )





};