import 'leaflet/dist/leaflet.css';
import { Popup, MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import './styling/map.css';
import L from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerShadowPng from "leaflet/dist/images/marker-shadow.png"
import { backendServer, getThrillreviewWebsiteLink } from "./helpers"
import axios from 'axios';
import { useEffect, useState } from 'react';

// weather interface
interface weatherInterface {
  imgSrc: string;
  description: string;
  feelsTemp: string;
}

// interface for pop up
interface popUpInfoInterface {
  markerLat: string;
  markerLong: string;
  themeParkName: string;
  themeParkId: string;
  weather: weatherInterface;
}

// ask the weather
async function AskWeather(lat: string, lon: string) {
  const WeatherAPIKey = "dca52658168de46d84c7d32b706c5bc5";
  const request = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WeatherAPIKey}`;
  const res = await axios.get(request, { withCredentials: false });
  const weather = res.data.weather[0]; // there is always only one weather item in array
  const icon = weather.icon;
  const weatherDescription = weather.description;
  const mainInfo = res.data.main;
  const feelsLike = (mainInfo.feels_like / 10).toFixed(1);
  const weatherInfo: weatherInterface = {
    imgSrc: `https://openweathermap.org/img/wn/${icon}@2x.png`,
    description: weatherDescription,
    feelsTemp: `${feelsLike}`,
  };

  return weatherInfo;
}

const Map = () => {
  const [allPopupInfo, setAllPopupInfo] = useState<popUpInfoInterface[]>([]);


  var themeParkIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
  })

  // set to user location
  function SetToUserLocation() {
    var map = useMap();
    map.locate({ setView: true, maxZoom: 5 });
    return null;
  }

  // look if id is in array
  function isIdInArray(a: popUpInfoInterface[], i: number): Boolean {
    let res = false;
    a.forEach(t => {
      if (t.themeParkId == i.toString()) res = true;
    });
    return res;
  }

  // ask all theme parks
  useEffect(() => {
    axios.get(backendServer(`/themeparks/find?page=0&limit=0`)).then((res) => {
      const { result } = res.data
      console.log("themeparks", result)
      let prevPopUpInfo: popUpInfoInterface[] = []
      result.map((info: any) => {
        console.log("info", info)
        const { lat, long, name, id } = info;
        // ask weather for the coordinate
        AskWeather(lat, long).then((weatherInfo: weatherInterface) => {
          const popUpInfo: popUpInfoInterface = {
            markerLat: lat,
            markerLong: long,
            themeParkName: name,
            themeParkId: id,
            weather: weatherInfo,
          }
          // store as pop up if no duplicate
          if (!isIdInArray(prevPopUpInfo, id)) {
            console.log("!id in array", id)
            prevPopUpInfo.push(popUpInfo);
            setAllPopupInfo(prevPopUpInfo);
          } 
          console.log("na array", id);
        });

      });
    });
  }, []);

  // make map, put all markers with pop up on map, set to user location
  const LeafletMap = () => {
    return (
      <MapContainer id="map" center={[50.823010, 4.392620]} zoom={15} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetToUserLocation />

        {allPopupInfo.map((p: popUpInfoInterface, i: number) => {
          console.log("i", i, "p", p.themeParkId)
          return (
            <Marker key={p.themeParkId} icon={themeParkIcon} position={[parseFloat(p.markerLat), parseFloat(p.markerLong)]}>
              <Popup>
                <h5>{p.themeParkName}</h5>
                <img src={p.weather.imgSrc} alt="weather icon" /><br />
                {p.weather.description}<br />
                The temperature feels like {p.weather.feelsTemp} &deg;C<br />
                <a href={getThrillreviewWebsiteLink('themeparks/' + p.themeParkId)}>Go to themepark page</a> for further details

              </Popup>
            </Marker>
          );
        })}

      </MapContainer>

    )
  }

  return (
    <LeafletMap />
  );

}



export default Map