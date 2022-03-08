import React, {useState, Fragment, useCallback, useEffect, useRef  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, MapConsumer } from 'react-leaflet';
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





var randomColor = require('randomcolor');


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}


export default function MainMap(props) {
  const ZOOM_LEVEL = 5;
  const classes = useStyles();

  const mapRef = useRef()
  const [loading, setLoading]   = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [vehicles, setVehicles] = React.useState([])

  const [mapState, setMapState] = React.useState('idle');
  const [mapLayers, setMapLayers] = React.useState([]);
  const [center, setCenter] = useState({ lat: -9.94667512, lng: -54.924356 });
  const [layerColor, setLayerColor] = useState('#ff0000')//randomColor());
  const [defaultColor, setDefaultColor] = useState('#4262ff');
  
  // this is the array that holds the layers drawn and the vehicles and colors of it
  // this will later be used to save in database
  const [vehicleLayer, setVehicleLayer] = useState([]) 

  const [openPopup, setOpenPopup] = useState(false);
  const [currentContext, setCurrentContext] = useState({
    color:'#FF0000',
    layer: null
  })

  const [customDraw, setCustomDraw] = useState({ 
    polyline:false,
    polygon:{shapeOptions: {color:layerColor, clickable: true, }}, 
    rectangle:false, 
    circle:false, 
    circlemarker:false,
  });

  
  const vehicleIcon = L.ExtraMarkers.icon({
    icon: 'fa-car',
    markerColor: '#ff0000',
    shape: 'circle',
    prefix: 'fa',
    svg: true,
  })

  const mapLayersRef = useRef([])
  const servicesRef = useRef(services)

  const clickedMapLayer = useRef();
  
  
  

  useEffect(() => {
    var t0 = performance.now();
    console.log('got to map eff')
    mapLayersRef.current = mapLayers 
    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
  }, [mapLayers]);


  useEffect(() => {
    var t0 = performance.now();
    console.log('got to serv eff')
    servicesRef.current = services
    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
  }, [services]);


  useEffect(()=>{
    if (props.user_data.username != ""){
      onPageLoad()
    }
  },[props.user_data])



  const deleteLayer = (e) => {
    const layers = mapLayersRef.current
    layers[currentContext.index].services.forEach( s => s.color = defaultColor)
    layers.splice(currentContext.index,1)
    
    mapRef.current.removeLayer(mapRef.current._layers[currentContext.id])

  }


  const handleLayerClick = (e) => {
    const layers = mapLayersRef.current
    clickedMapLayer.current = e

    // layers.forEach( (l, i) => {
    //   if(l.id === e.target._leaflet_id){
    //     var curctx = {
    //       id: l.id,
    //       index: i, 
    //       color: l.color, 
    //       layer: e.target, 
    //       finishFunction: finishLayerClick,
    //       vehicle: l.vehicle
    //     }
    //     console.log(curctx)
    //     setCurrentContext(curctx)
    //   }
    // });

    var lc = layers.filter(l => l.id == e.target._leaflet_id)[0]
    console.log(lc)
    var curctx = {
      id: lc.id,
      color: lc.color, 
      layer: e.target, 
      finishFunction: finishLayerClick,
      vehicle: lc.vehicle
    }
    console.log(curctx)
    
    setCurrentContext(curctx)


    setOpenPopup(true)
  }


  const finishLayerClick = (context) => {
    var new_layer = {}
    context.layer.setStyle({color: context.color})
    mapLayersRef.current.forEach(l => {
      //console.log(l)
      if(l.id === context.id){ 
        new_layer = {
          ...l, 
          vehicle: context.vehicle, 
          color: context.color,
        }
        new_layer = {...new_layer, route: createRoute(new_layer) }
        new_layer = {...new_layer, services: checkInvolvedMarkers(new_layer) }
      }
      
      console.log('here')
      console.log(clickedMapLayer['current'])
      var popup = L.popup({
        autoClose: false, 
        closeOnClick: false,
        closeOnEscapeKey: false,
        noWrap: true,
        opacity: 0.9
      });
      popup.setContent(context.vehicle);
      clickedMapLayer['current'].target.bindPopup(popup).openPopup();
      
      //console.log(clickedMapLayer['current'].target.bindTooltip(context.vehicle))
      //context.vehicle != '' ? clickedMapLayer['current'].target.bindTooltip(context.vehicle).permanent() : clickedMapLayer['current'].target.bindPopup('NA')
    });
    setMapLayers([
      ...mapLayersRef.current.filter(e => e.id != new_layer.id), 
      new_layer
    ])
    
  }


  function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        // var xi = vs[i][0], yi = vs[i][1];
        // var xj = vs[j][0], yj = vs[j][1];
        var xi = vs[i].lat, yi = vs[i].lng;
        var xj = vs[j].lat, yj = vs[j].lng;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
  };

 
  function onPageLoad(){
    setLoading(true);
    fetch('http://localhost:8000/api/get-fileinfo/?username='+props.user_data.username + '&ftype=service_input', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
      // define the columns the will be getting from the api call of the file infos
      // TODO have to include the columns from additional informations
      let serv_coords = null
      let serv_key    = null

      let vehi_coords = null
      let vehi_key    = null

      json.forEach(i => {
        // loop files and separate service input and vehicle input
        if(i.filetype == "service_input"){ 
          serv_coords = JSON.parse(i.coords_columns)
          serv_key    = JSON.parse(i.key_column) 
        }
        else if (i.filetype == "vehicle_input") { 
          vehi_coords = JSON.parse(i.coords_columns) 
          vehi_key    = JSON.parse(i.key_column)
        }
      })
      //const coords = JSON.parse(json[0].coords_columns)
      fetch('http://localhost:8000/api/get-serv/?username='+props.user_data.username, {
        method: 'GET',
      })
      .then(res => res.json())
      .then(json =>  {
          console.log('LoadingMap')

          const parsedJson_serv = json.map( j => {
            var i = JSON.parse(j.values)
            return {
              coord: [parseFloat(i[serv_coords.lat].replace(",", ".")), parseFloat(i[serv_coords.lng].replace(",", "."))],
              popup: i[serv_key.key],
              color: defaultColor,
              layer: null
            }
          })

          setServices( parsedJson_serv )
          

          fetch('http://localhost:8000/api/get-vehicles/?username='+props.user_data.username, {
            method: 'GET',
          })
          .then(res => res.json())
          .then(json => {

            const parsedJson_vehi = json.map( j => {
              var i = JSON.parse(j.values)
              return {
                coord: [parseFloat(i[vehi_coords.lat].replace(",", ".")), parseFloat(i[vehi_coords.lng].replace(",", "."))],
                popup: i[vehi_key.key]
              }
            })

            
            setVehicles( parsedJson_vehi )
            setLoading(false);
            console.log('Done with services')
          })
        })
    })
    
  }

  
  function checkInvolvedMarkers(layer){
    var t0 = performance.now()
    
    let inside_services = []
    let replace_services = []
    servicesRef.current.forEach(marker => {
      if (inside(marker.coord, layer.latlngs) == true) {
        var i = {
          ...marker,
          color: layer.color,
          layer: layer
        }
        inside_services.push(i)
        replace_services.push(i)
      }
      else{
        if( marker.layer != null && marker.layer.id == layer.id) {
          var i = {
            ...marker,
            color: defaultColor,
            layer: null
          }
          replace_services.push(i)
        } else {
          replace_services.push(marker)
        }
        
      }
    });
    setServices(replace_services)

    // if there is a route, and a valid vehicle is chosen
    if(layer.route != null && layer.vehicle != ''){
      drawRoute(layer)
    }

    var t1 = performance.now();
    console.log("Call to checkinvolved took " + (t1 - t0) + " milliseconds.");

    return inside_services
  }


  function createRoute(layer) {

    var coords = [
      vehicles.filter(v => v.popup == layer.vehicle)[0].coord, 
      ...layer.services.map( s => s.coord)
    ]
    console.log(coords)
    var route = { coords: coords, color:layer.color }
    return route
  }


  function drawRoute(l){
      var r = l.route
      var string = '';
      var points = [];
      r.coords.forEach(i => {
        points.push(L.latLng(i))
        string = string+L.latLng(i).lng.toString()+','+L.latLng(i).lat.toString()+';'
      });
      string = string.substring(0, string.length - 1)+'?annotations=distance'
      // fetch('http://router.project-osrm.org/table/v1/driving/'+string, {
      //   method: 'GET',
      // })
      // .then(res => res.json())
      // .then(json => console.log(json))



      fetch('http://router.project-osrm.org/trip/v1/driving/'+string, {
        method: 'GET',
      })
      .then(res => res.json())
      .then(json => {
        console.log('optimal Route')
        console.log(json)
        var points = [];
        var sorted_json = sort_by_key(json.waypoints, 'waypoint_index')
        sorted_json.forEach(i => points.push(L.latLng([i.location[1],i.location[0]])) )
        // while (points.length < json.waypoints.length) {
        //   var i = json.waypoints.filter( l => l.waypoint_index == points.length )
        //   points.push(L.latLng([i[0].location[1],i[0].location[0]]))
        // }
        
        const instance = L.Routing.control({
          waypoints: points,
          show: false,
          lineOptions: {
            styles: [{
              className: 'animate',
              color: r.color
            }] // Adding animate class
          },
          addWaypoints: false,
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: false,
          createMarker: (i, wp, nWps) => {
            if (i === 0){
              return L.marker( wp.latLng, {
                icon: L.ExtraMarkers.icon({
                        icon: 'fa-car',
                        markerColor: r.color,
                        shape: 'circle',
                        prefix: 'fa',
                        svg: true,
                      }
              )})
            }
            return null
          }
  
        })
        instance.addTo(mapRef.current)  
        console.log(instance)
        console.log('Route here')
        l = {
          ...l, 
          routeDraw: instance 
        }
      })
  }



  const _onCreated = (e) => {
    var t0 = performance.now()

    console.log('creating')
    console.log(e)
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      layer.on({click: handleLayerClick})//`<div class="leaflet-popup-content-wrapper"><div class="leaflet-popup-content" style="width: 197px;"><div class="MuiFormControl-root makeStyles-formControl-51"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated" data-shrink="false" id="vehicle-selector-label">Equipe</label><div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"><div class="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input" tabindex="0" role="button" aria-haspopup="listbox" aria-labelledby="vehicle-selector-label vehicle-selector" id="vehicle-selector"><span>​</span></div><input aria-hidden="true" tabindex="-1" class="MuiSelect-nativeInput" value=""><svg class="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div><p class="MuiFormHelperText-root">Escolha a equipe para esta rota</p></div></div></div>`)//'<div class="MuiFormControl-root makeStyles-formControl-28"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated" data-shrink="false" id="vehicle-selector-label">Equipe</label><div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"><div class="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input" tabindex="0" role="button" aria-haspopup="listbox" aria-labelledby="vehicle-selector-label vehicle-selector" id="vehicle-selector" style=""><span>​</span></div><input aria-hidden="true" tabindex="-1" class="MuiSelect-nativeInput" value=""><svg class="MuiSvgIcon-root MuiSelect-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div><p class="MuiFormHelperText-root">Escolha a equipe para esta rota</p></div>')
      const { _leaflet_id } = layer;
      console.log('leaflet id = ' + _leaflet_id)
      var new_layer = {
        id: _leaflet_id, 
        latlngs: layer.getLatLngs()[0], 
        color: layerColor, 
        vehicle: '',
        services: [],
        route: null,
        routeDraw: null
      }
      setMapLayers(layers => 
        [...layers, 
          {...new_layer, services:checkInvolvedMarkers(new_layer)}
        ]);
      
    }
    console.log(loading)
    setLayerColor(randomColor())

    var t1 = performance.now();
    console.log("Call to onCreate took " + (t1 - t0) + " milliseconds.");
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
  }
  


  const handleMapState = () => {
    switch (mapState) {
      case 'idle':
        return (<Fragment />)
        break;

      case 'draw':
        return (
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

      default:
        break;
    }
  }




  function handleRouting(){
    if(servicesRef.current.length > 0) {
      //return <RoutingMachine points={servicesRef.current} map={mapRef.current}/>
      var points = [];
      servicesRef.current.forEach(i => {
        points.push(L.latLng(i))
      });
      const instance = L.Routing.control({
        waypoints: points,
        show: false,
        lineOptions: {
          styles: [{className: 'animate'}] // Adding animate class
        },
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,

      }).addTo(props.map.current)      
    }

    return <React.Fragment />
  }
  
  const handleCloseDialog = () => {
    setOpenPopup(false);
  };


  const fabSideMargin = '20px'
  const fabButtons = [
    {tooltip:'Visualizar', fabOnClick: () => setMapState('idle'), icon: <VisibilityIcon />    },
    {tooltip:'Desenhar'  , fabOnClick: () => setMapState('draw'), icon: <GestureTwoToneIcon />}
  ];

  return (
    <div style={{height:'90%', width:'100%', minHeight: '100%', minWidth: '100%'}}>
      
      {fabButtons.map((fab) => (
        <Fab 
          key={fab.tooltip}
          color="primary" 
          aria-label="add" 
          style={{zIndex: 999, position:'fixed', bottom:'20px', right: fabSideMargin}} 
          onClick={fab.fabOnClick}
        >
          {fab.icon}
        </Fab>
      ))}
      
       
      
      <MapContainer center={center} zoom={ZOOM_LEVEL} scrollWheelZoom={true}> 
        <MapConsumer>
          {(map) => {
            mapRef.current = map
            return null
          }}
        </MapConsumer> 
          {handleMapState()}
          <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {!loading && services.map((marker, i) => (
            <Marker 
              key={i} 
              position={marker.coord} 
              
              icon={L.ExtraMarkers.icon({
                icon: 'fa-star',
                markerColor: marker.color,
                shape: 'circle',
                prefix: 'fa',
                svg: true,
              })}>
              <Popup>
                  {marker.popup}
              </Popup>
              
            </Marker>
          ))}
          
          {openPopup && <VehicleDialogWindow open={openPopup} close={handleCloseDialog} vehicles={vehicles} currentContext={currentContext} deleteFunc={deleteLayer}/>}
        
      </MapContainer>
      
    </div>
      
    );
  }

//{handleRouting()}
  