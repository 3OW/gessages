import axios from "axios";
import {
  LocationQuery,
  Message,
  MessageIdType,
  StatusMessage,
  Thread,
  ThreadIdType,
  ThreadsObject,
  ApiError,
  Location,
} from "./types/common-types";

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.code == "ECONNREFUSED") {
    const res = {
      errortype: "ECONNREFUSED",
      message: "No connection tothe backend",
    };
    return res;
  }

  if (axios.isAxiosError(error) && error.response) {
    const res: Partial<ApiError> = {};
    res["statusCode"] = error.response?.status;
    res["errortype"] = error.response?.statusText;
    if (
      Object.prototype.hasOwnProperty.call(error.response?.data, "message") &&
      typeof (error.response?.data["message"] == String)
    ) {
      res["message"] = error.response?.data["message"];
    }
    return res;
  } else {
    console.log(error);
  }
};

export const getThreadById = async (
  path: string,
  id: ThreadIdType,
  jwt: string
): Promise<Partial<Thread> | ApiError> => {
  let response;
  try {
    response = await axios.get(`${path}/thread/${id}`, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <Partial<Thread>>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const postThread = async (
  path: string,
  thread: Partial<Thread>,
  jwt: string
): Promise<Partial<Thread> | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.post(`${path}/thread/`, thread, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 201) {
      if (response.data.id) {
        return <Partial<Thread>>response.data;
      }
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const getNearThreadsAll = async (
  path: string,
  query: LocationQuery,
  jwt: string
): Promise<Partial<Thread> | ThreadsObject | ApiError> => {
  let response;
  try {
    response = await axios.get(
      `${path}/thread/near/${query.lon}/${query.lat}/${query.rad}/true`,
      { headers: { Authorization: "Bearer " + jwt } }
    );
    if (response.status == 200) {
      return <Partial<ThreadsObject>>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

// TODO: add Selectable parameters
export const getNearThreadsSelect = async (
  path: string,
  query: LocationQuery,
  jwt: string
): Promise<Partial<Thread> | ThreadsObject | ApiError> => {
  let response;
  try {
    response = await axios.get(
      `${path}/thread/near/${query.lon}/${query.lat}/${query.rad}/false`,
      { headers: { Authorization: "Bearer " + jwt } }
    );
    if (response.status == 200) {
      return <Partial<ThreadsObject>>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const updateThread = async (
  path: string,
  id: ThreadIdType,
  thread: Partial<Thread>,
  jwt: string
): Promise<ThreadIdType | StatusMessage | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.put(`${path}/thread/${id}`, thread, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <ThreadIdType>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const deleteThread = async (
  path: string,
  id: ThreadIdType,
  jwt: string
): Promise<StatusMessage | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.delete(`${path}/thread/${id}`, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <StatusMessage>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const getMessage = async (
  path: string,
  thdId: ThreadIdType,
  msgId: MessageIdType,
  jwt: string
): Promise<Partial<Message> | ApiError> => {
  let response;
  try {
    response = await axios.get(`${path}/message/${thdId}/${msgId}`, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <Partial<Message>>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const postMessage = async (
  path: string,
  thdId: ThreadIdType,
  message: Partial<Message>,
  jwt: string
): Promise<MessageIdType | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.post(`${path}/message/${thdId}`, message, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 201) {
      return <MessageIdType>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const deleteMessage = async (
  path: string,
  thdId: ThreadIdType,
  msgId: MessageIdType,
  jwt: string
): Promise<StatusMessage | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.delete(`${path}/message/${thdId}/${msgId}`, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <StatusMessage>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const updateMessage = async (
  path: string,
  thdId: ThreadIdType,
  msgId: MessageIdType,
  message: Partial<Message>,
  jwt: string
): Promise<MessageIdType | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.put(`${path}/message/${thdId}/${msgId}`, message, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <MessageIdType>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export {
  Location,
  LocationQuery,
  Message,
  MessageIdType,
  StatusMessage,
  Thread,
  ThreadIdType,
  ThreadsObject,
  ApiError,
};
