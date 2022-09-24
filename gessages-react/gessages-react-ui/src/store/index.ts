import { configureStore } from "@reduxjs/toolkit";

import geoLocation from "./geoLocationSlice";
import notification from "./notificationSlice";
import nearThreads from "./nearThreadsSlice";
import mapCenter from "./mapCenter";

const store = configureStore({
  reducer: {
    geoLocation: geoLocation,
    nearThreads: nearThreads,
    notification: notification,
    mapCenter: mapCenter,
  },
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {geoLocation: geoLocationState ...}
export type AppDispatch = typeof store.dispatch;
