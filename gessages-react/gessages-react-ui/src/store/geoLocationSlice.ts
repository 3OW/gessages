import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

interface GeoLocationState {
  lat: number;
  lon: number;
}

const initialState: GeoLocationState = {
  lat: 52.52437,
  lon: 13.41053,
};

const geoLocation = createSlice({
  name: "geoLocation",
  initialState,
  reducers: {
    update(state: GeoLocationState, action: PayloadAction<GeoLocationState>) {
      state.lat = action.payload.lat;
      state.lon = action.payload.lon;
    },
  },
});

export const geoLocationActions = geoLocation.actions;

export const selectGeoLocationLat = (state: RootState) => state.geoLocation.lat;
export const selectGeoLocationLon = (state: RootState) => state.geoLocation.lon;

export default geoLocation.reducer;
