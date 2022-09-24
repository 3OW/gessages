import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

interface Notification {
  status: String;
  title: String;
  message: String;
}

interface NotificationState {
  isVisible: boolean;
  notification: Notification;
}

const initialState: NotificationState = {
  isVisible: false,
  notification: { status: "", title: "", message: "" },
};

const notification = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<Notification>) {
      state.notification.status = action.payload.status;
      state.notification.title = action.payload.title;
      state.notification.message = action.payload.message;
    },
  },
});

export const geoLocationActions = notification.actions;

export const selectshowNotificationisVisible = (state: RootState) =>
  state.notification.isVisible;
export const selectshowNotificationStatus = (state: RootState) =>
  state.notification.notification.status;
export const selectshowNotificationTitle = (state: RootState) =>
  state.notification.notification.title;
export const selectshowNotificationMessage = (state: RootState) =>
  state.notification.notification.message;

export default notification.reducer;
