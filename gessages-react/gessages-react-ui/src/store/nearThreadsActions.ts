import { nearThreadsActions } from "./nearThreadsSlice";
import { AppDispatch } from ".";
import {
  ApiError,
  getNearThreadsAll,
  LocationQuery,
  Thread,
  ThreadsObject,
} from "gessages-messages";

export const fetchNearTheads = (path: string, query: LocationQuery) => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response: Partial<Thread> | ThreadsObject | ApiError =
        await getNearThreadsAll(path, query);
      console.log("RESPNSE:");
      console.log(response);

      if (!response) {
        throw new Error("Could not fetch threads!");
      }

      const data = await response;

      return data;
    };

    try {
      const data = await fetchData();
      console.log("Now dispatching!!!");
      dispatch(nearThreadsActions.update(data));
    } catch (error) {
      console.log("Update nearThreads Error:");
      console.log(error);
    }
  };
};
