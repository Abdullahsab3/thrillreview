import 'leaflet/dist/leaflet.css';
import {Popup, MapContainer, TileLayer, Marker, useMap} from 'react-leaflet';
import './styling/map.css';
import L from 'leaflet';
import {Helmet} from 'react-helmet-async';
import { useState, useEffect } from 'react';

import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'


function SetToUserLocation() {
  var map = useMap();
  map.locate({setView: true, maxZoom: 15});
  return null;
}

function getAllThemeParks(){
  // Breedtegraad (latitude): 51.0808505
//Lengtegraad (longitude): 
  return [["51.0808505", "2.5987627", "plopsaland", "https://leafletjs.com/examples.html"],
         ["50.6925","4.5877", "walibi", "https://nl.wikipedia.org/wiki/Walibi_Belgium"]];
}

function AddThemeParkToMap(input: Array<string>){
  var map = useMap();
  const marker = L.marker([parseFloat(input[0]), parseFloat(input[1])]).addTo(map);
  const text = `${input[2]} <a href=${input[3]}> Click to go to page</a>`
  marker.bindPopup(text);
  //"plopsaland de panne <a href=\"https://leafletjs.com/examples.html\">test</a>"
}

function AddThemeParksToMap(){
 
  var themeParkInfo = getAllThemeParks()
  themeParkInfo.forEach(AddThemeParkToMap)
  
  return null;
}


const LeafletMap = () => {

  return(
  <MapContainer id="map" center={[50.823010, 4.392620]} zoom={15} scrollWheelZoom={false}>
       <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       />
       <SetToUserLocation />
       <AddThemeParksToMap />
  </MapContainer>
    
  )
}



const Map = () => {

  //  <Helmet>
  //      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  //  </Helmet>
        
    return(
        
      
      <LeafletMap /> 
   
    
    )

}



export default Map