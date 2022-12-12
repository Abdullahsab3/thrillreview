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
import { Card } from 'react-bootstrap';

interface weatherInterface {
  imgSrc: string;
  description: string;
  feelsTemp: string;
}

async function AskWeather(lat: string, lon: string) {
  const WeatherAPIKey = "dca52658168de46d84c7d32b706c5bc5";
  const request = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WeatherAPIKey}`;
  const res = await axios.get(request, { withCredentials: false });
  const weather = res.data.weather[0]; // there is always only one weather item in array
  const icon = weather.icon;
  const weatherDescription = weather.description;
  const mainInfo = res.data.main;
  const feelsLike = (mainInfo.feels_like / 10).toFixed(1);
  //console.log(res);
  const weatherInfo: weatherInterface = {
    imgSrc: `http://openweathermap.org/img/wn/${icon}@2x.png`,
    description: weatherDescription,
    feelsTemp: `${feelsLike}&deg;C`,
  };

  return weatherInfo;
}

const Map = () => {



  function BoundsChange() {
    var map = useMap()
    function onChange() {
      const bounds: LatLngBounds = map.getBounds();
      const NWcorner = bounds.getNorthWest(); // min latlong
      const SEcorner = bounds.getSouthEast(); // maxlatlong
      const minlat = NWcorner.lat;
      const maxlat = SEcorner.lat;
      const minlong = NWcorner.lng;
      const maxlong = SEcorner.lng;
      //console.log(``);
      axios.get(backendServer(`themepark/in-range-of-coordinates/${minlat}&${maxlat}&${minlong}&${maxlong}`)).then((res) => {
        if (res.data) {
          console.log(res.data)
        }
      })/*.catch(function (error) {
        if (error.response) {
          alert(`error: ${error.response}`)
        } else alert(`an error but no error response ${error}`);
      })*/
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

  function makePopUpContent(name: string, id: string, weather: weatherInterface) {

    return (`<div className="popUpMarkerContent">
        <h5>${name}</h5>
        <div>
          <img src=${weather.imgSrc} alt="weather icon"><br/>
          ${weather.description}<br/>
          The temperature feels like ${weather.feelsTemp}
        </div>
        </div>`);
  }
  async function AddThemeParkToMap(input: Array<string>) {
    const lat = input[0];
    const long = input[1];
    var map = useMap();
    const marker = L.marker([parseFloat(lat), parseFloat(long)], { icon: themeParkIcon }).addTo(map);
    const text = `${input[2]} <a href=${input[3]}> Click to go to page</a>`
    const weather = await AskWeather(lat, long);
    console.log(`the image source : ${weather.imgSrc}, desc: ${weather.description}, feels: ${weather.feelsTemp}`)
    marker.bindPopup(
     makePopUpContent("walibi", "0", weather));
     // I know this is stupid, but the first stime you open the pop up, something is wrong with the display.
    marker.openPopup() 
    marker.closePopup()
  }

  function AddThemeParksToMap() {

    var themeParkInfo = getAllThemeParks()
    themeParkInfo.forEach(AddThemeParkToMap)

    return null;
  }


  const LeafletMap = () => {
    // NOG TOEVOEGEN<BoundsChange />
    return (
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

  return (


    <LeafletMap />


  );

}



export default Map