export type ImageUrlType = string;
export type ImagesType = Array<ImageUrlType> | null;
export type TimestampType = number;
export type UserIdType = string;

export type ApiError = {
  statusCode?: number;
  errortype?: string;
  message?: string;
};

export type AuthResponse = {
  auth: boolean;
  jwt: string;
  userId: string;
};

export type ErrorMessage = {
  error: string;
};

export type ExternalUserId = {
  provider: string;
  userId: string;
};

export type Location = {
  lon: number;
  lat: number;
  timestamp: TimestampType;
};

export type StatusMessage = {
  status: string;
};

export type User = {
  id: UserIdType;
  externalUserId: ExternalUserId;
  userName: string;
  password: string;
  logo: ImageUrlType;
  location: Location;
  latestLocations: Array<Location>;
  createdAt: TimestampType;
  updatedAt: TimestampType;
};

export type UserCredentials = {
  id: UserIdType;
  password: string;
};
