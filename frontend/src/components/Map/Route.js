import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
	console.log(props.map)
  const points = [];
	props.points.forEach(i => {
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
		
		


  })
  //instance.addTo(L.map.leafletElement)
  instance.addTo(props.map)

};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;