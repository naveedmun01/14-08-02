
import React, {useEffect, useState} from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const OPEN_KEY = "8660f7e218434dbad073226a6a3d98fc";

export default function App(){
  const [coords,setCoords]=useState({lat:24.8607,lon:67.0011,name:'Karachi'});
  const [data,setData]=useState(null);

  useEffect(()=>{
    async function fetchData(){
      try{
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPEN_KEY}`;
        const res = await fetch(url);
        const j = await res.json();
        setData(j);
      }catch(e){ setData(null); }
    }
    fetchData();
  },[coords]);

  return (
    <div style={{minHeight:'100vh', background:'#0f172a', color:'#fff', padding:16}}>
      <h1>WeatherPro-update by Mun Developers</h1>
      <div style={{marginTop:16}}>
        {data ? (
          <div>Current Temp: {Math.round(data.current.temp)}°C, Weather: {data.current.weather[0].description}</div>
        ) : <div>Loading...</div>}
      </div>
      <div style={{marginTop:16, height:400}}>
        <MapContainer center={[coords.lat, coords.lon]} zoom={9} style={{height:'100%', width:'100%'}}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OSM">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            </LayersControl.BaseLayer>
            <LayersControl.Overlay checked name="Radar (RainViewer)">
              <TileLayer url="https://tilecache.rainviewer.com/v2/radar/nowcast/0/256/{z}/{x}/{y}/2/1_1.png" opacity={0.6}/>
            </LayersControl.Overlay>
          </LayersControl>
          <Marker position={[coords.lat, coords.lon]}><Popup>{coords.name}</Popup></Marker>
        </MapContainer>
      </div>
    </div>
  );
}
