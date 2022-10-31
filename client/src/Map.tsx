import 'leaflet/dist/leaflet.css';
import {Popup, MapContainer, TileLayer, Marker} from 'react-leaflet';
import './map.css';
import L from 'leaflet';
import {Helmet} from 'react-helmet-async';


const LeafletMap = () => {
    return(
        
    <MapContainer id="map" center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            
       <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       />
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