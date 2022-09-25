import axios from "axios";
import {
  ApiError,
  AuthResponse,
  ErrorMessage,
  StatusMessage,
  User,
  UserCredentials,
  UserIdType,
} from "./types/common-types";

type ErrorType = {
  error?: string;
};

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
    res.statusCode = error.response.status;
    res.errortype = error.response.statusText;
    const data = <ErrorType>error.response.data;
    if (
      typeof data == "object" &&
      data != null &&
      "error" in data &&
      typeof data["error"] === "string"
    ) {
      res.message = data["error"];
    }
    return res;
  } else {
    //TODO handle non Axios errors
    console.log(error);
  }
};

export const createUser = async (
  path: string,
  user: Partial<User>
): Promise<Partial<User> | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.post(`${path}/signup/`, user);
    if (response.status == 201) {
      if (response.data.id) {
        return <Partial<User>>response.data;
      }
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const deleteUser = async (
  path: string,
  id: UserIdType,
  jwt: string
): Promise<StatusMessage | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.delete(`${path}/user/${id}`, {
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

export const getUserById = async (
  path: string,
  id: UserIdType,
  jwt: string
): Promise<Partial<User> | ApiError> => {
  let response;
  try {
    response = await axios.get(`${path}/user/${id}`, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <Partial<User>>response.data;
    }
  } catch (error: unknown) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const signIn = async (
  path: string,
  creds: UserCredentials
): Promise<AuthResponse | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.post(`${path}/signin/`, creds);
    if (response.status == 201) {
      if (response.data.jwt) {
        return <AuthResponse>response.data;
      }
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export const updateUser = async (
  path: string,
  id: UserIdType,
  user: Partial<User>,
  jwt: string
): Promise<UserIdType | StatusMessage | Partial<ApiError>> => {
  let response;
  try {
    response = await axios.put(`${path}/user/${id}`, user, {
      headers: { Authorization: "Bearer " + jwt },
    });
    if (response.status == 200) {
      return <UserIdType>response.data;
    }
  } catch (error) {
    return <Partial<ApiError>>handleError(error);
  }
  return {};
};

export {
  ApiError,
  AuthResponse,
  ErrorMessage,
  StatusMessage,
  User,
  UserCredentials,
  UserIdType,
};
