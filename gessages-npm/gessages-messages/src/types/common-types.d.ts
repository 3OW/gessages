export type ImageUrlType = string;
export type UserIdType = string;
export type PlaceIdType = string;
export type TimestampType = number;
export type ImagesType = Array<ImageUrlType> | null;
export type MessageIdType = `msg-${string}`;
export type ThreadIdType = `thd-${string}`;

export type Location = {
  lon: number;
  lat: number;
  timestamp: TimestampType;
};

export type LocationQuery = {
  lon: number;
  lat: number;
  rad: number;
};

export type Message = {
  id: MessageIdType;
  userId: UserIdType;
  userName: string;
  userLogo: ImageUrlType;
  parentId: MessageIdType | ThreadIdType | null;
  threadId: ThreadIdType;
  location: Location;
  message: string;
  images: ImagesType;
  createdAt: TimestampType;
  updatedAt: TimestampType;
};

export type MessagesObject = {
  [key: MessageIdType]: Partial<Message>;
};

export type Thread = {
  id: ThreadIdType;
  userId: UserIdType;
  userName: string;
  userLogo: string;
  location: Location;
  message: string;
  messages?: MessagesObject;
  images?: ImagesType | null;
  createdAt: TimestampType;
  updatedAt: TimestampType;
};

export type ThreadsObject = {
  [key: ThreadIdType]: Partial<Thread>;
};

export type StatusMessage = {
  status: string;
};

export type ErrorMessage = {
  error: string;
};

export type ApiError = {
  statusCode?: number;
  errortype?: string;
  message?: string;
};
