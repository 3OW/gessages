import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { ThreadsObject } from "gessages-messages";

const initialState: ThreadsObject = {};

const nearThreads = createSlice({
  name: "nearThreads",
  initialState,
  reducers: {
    update(state: ThreadsObject, action: PayloadAction<ThreadsObject>) {
      return action.payload;
    },
  },
});

export const nearThreadsActions = nearThreads.actions;

export const selectNearThreads = (state: RootState) => state.nearThreads;

export default nearThreads.reducer;
