import React from "react";
import { MapContainer, ZoomControl, ScaleControl } from "react-leaflet";
import "./Map.css";
import Layers from "./Layers";
import { useAppSelector } from "../../hooks";

const Map = () => {
  const currentLocation = useAppSelector((store) => store.geoLocation);
  return (
    <>
      <MapContainer
        center={[currentLocation.lat, currentLocation.lon]}
        zoom={14}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <Layers />
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" />
      </MapContainer>
    </>
  );
};

export default Map;
