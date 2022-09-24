import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

interface MapCenterState {
  lat: number;
  lon: number;
}

const initialState: MapCenterState = {
  lat: 52.52437,
  lon: 13.41053,
};

const mapCenter = createSlice({
  name: "mapCenter",
  initialState,
  reducers: {
    update(state: MapCenterState, action: PayloadAction<MapCenterState>) {
      state.lat = action.payload.lat;
      state.lon = action.payload.lon;
    },
  },
});

export const mapCenterActions = mapCenter.actions;

export const selectGeoLocationLat = (state: RootState) => state.mapCenter.lat;
export const selectGeoLocationLon = (state: RootState) => state.mapCenter.lon;

export default mapCenter.reducer;
