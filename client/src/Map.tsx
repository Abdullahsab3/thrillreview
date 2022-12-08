import 'leaflet/dist/leaflet.css';
import { Popup, MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import './styling/map.css';
import L from 'leaflet'
import { LatLngBounds } from 'leaflet';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerShadowPng from "leaflet/dist/images/marker-shadow.png"
import { Icon } from 'leaflet'
import { backendServer } from "./helpers"
import axios from 'axios';


const Map = () => {

  function BoundsChange() {
    var map = useMap()
    function onChange() {
      const bounds: LatLngBounds = map.getBounds();
      const NWcorner = bounds.getNorthWest(); // min latlong
      const SEcorner = bounds.getSouthEast(); // maxlatlong
      console.log(`nw: ${NWcorner}, se ${SEcorner}`);
      axios.get(backendServer('themepark/in-range-of-coordinates'), {
        params: {
          // order: minlat maxlat minlong maxlong
          minlat: NWcorner.lat,
          maxlat: SEcorner.lat,
          minlong: NWcorner.lng,
          maxlong: SEcorner.lng,
        }
      }).then((res) => {
        if (res.data) {
          console.log(res.data)
        }
      })

    }

    map.on('moveend', onChange)
    return null;
  }



  var themeParkIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
  })



  function SetToUserLocation() {
    var map = useMap();
    map.locate({ setView: true, maxZoom: 15 });
    return null;
  }



  function getAllThemeParks() {
    // Breedtegraad (latitude): 51.0808505
    //Lengtegraad (longitude): 
    //axios.get("themepark/in-range-of-coordinates", findThemeParksInCoordinatesRange)
    return [["51.0808505", "2.5987627", "plopsaland", "https://leafletjs.com/examples.html"],
    ["50.6925", "4.5877", "walibi", "https://nl.wikipedia.org/wiki/Walibi_Belgium"]];
  }

  function AddThemeParkToMap(input: Array<string>) {
    var map = useMap();
    const marker = L.marker([parseFloat(input[0]), parseFloat(input[1])], { icon: themeParkIcon }).addTo(map);
    const text = `${input[2]} <a href=${input[3]}> Click to go to page</a>`
    marker.bindPopup(text);
  }

  function AddThemeParksToMap() {

    var themeParkInfo = getAllThemeParks()
    themeParkInfo.forEach(AddThemeParkToMap)

    return null;
  }


  const LeafletMap = () => {

    return (
      <MapContainer id="map" center={[50.823010, 4.392620]} zoom={15} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetToUserLocation />
        <AddThemeParksToMap />
        <BoundsChange />
      </MapContainer>

    )
  }

  return (


    <LeafletMap />


  )

}



export default Map