import React, { useEffect } from "react";
import {
  TileLayer,
  LayersControl,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import { geoLocationActions } from "../../store/geoLocationSlice";
import { mapCenterActions } from "../../store/mapCenter";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { ThreadsObject } from "gessages-messages";
import { messagesBackend } from "../../config";
import { fetchNearTheads } from "../../store/nearThreadsActions";
import { icon } from "leaflet";

const Layers: React.FC = () => {
  //debugger;
  const dispatch = useAppDispatch();
  const currentLocation = useAppSelector((store) => store.geoLocation);
  const nearThreads = useAppSelector((store) => store.nearThreads);
  const currentMaoCenter = useAppSelector((store) => store.mapCenter);

  const map = useMapEvents({
    zoomend: () => {
      console.log(map.getZoom());
    },
    moveend: () => {
      console.log(map.getBounds());
      let ct = map.getCenter();
      dispatch(mapCenterActions.update({ lat: ct.lat, lon: ct.lng }));
    },
  });

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      dispatch(
        geoLocationActions.update({ lat: e.latlng.lat, lon: e.latlng.lng })
      );
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [dispatch, map]);

  //TODO: change RADD according to zoom level
  useEffect(() => {
    console.log("fetchedThreads");
    dispatch(
      fetchNearTheads(messagesBackend, {
        lat: currentLocation.lat,
        lon: currentLocation.lon,
        rad: 50,
      })
    );
  }, [currentLocation.lat, currentLocation.lon, dispatch, currentMaoCenter]);

  const ICON = icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 41],
  });

  type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;
  
  type PartialUnion<T> = UnionToIntersection<
    T extends any ? Partial<T> : never
  >;

  return (
    <>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OSM-DE">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png'"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OSM">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Mapbox">
          <TileLayer
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
            id="mapbox/streets-v11"
            accessToken="pk.eyJ1IjoidGFyLWhlbCIsImEiOiJjbDJnYWRieGMwMTlrM2luenIzMzZwbGJ2In0.RQRMAJqClc4qoNwROT8Umg"
            tileSize={512}
            zoomOffset={-1}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {Object.entries(nearThreads).length > 0 &&
        Object.values(nearThreads).map(
          (location: UnionToIntersection<ThreadsObject>, i: number) => (
            <Marker
              icon={ICON}
              key={`marker-${location.id}`}
              position={[location.location.lat, location.location.lon]}
            >
              <Popup>{location.message}</Popup>
            </Marker>
          )
        )}
    </>
  );
};

export default Layers;
