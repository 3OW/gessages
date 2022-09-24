"use strict";

//TODO: check proper validation of all schemas

// min/max taken from https://redis.io/commands/geoadd
export const locationType = {
  type: "object",
  $id: "locationType",
  required: ["lon", "lat", "timestamp"],
  properties: {
    lon: { type: "number", minimum: -180, maximum: 180 },
    lat: { type: "number", minimum: -85.05112878, maximum: 85.05112878 },
    timestamp: { type: "number", minimum: 1633345319 },
  },
  additionalProperties: false,
};

export const externalUserIdType = {
  type: "object",
  $id: "externalUserIdType",
  required: ["provider", "userId"],
  properties: {
    provider: { type: "string" },
    userId: { type: "string" },
  },
  additionalProperties: false,
  nullable: true,
};

export const friendType = {
  type: "object",
  $id: "friendType",
  required: ["userId", "addedAt"],
  properties: {
    userId: { type: "string" },
    addedAt: { type: "number" },
  },
  additionalProperties: false,
  nullable: true,
};

/*
export const zoneType = {
  type: "object",
  $id: "zoneType",
  required: ["lon", "lat", "timestamp", "radius"],
  properties: {
    lon: { type: "number", minimum: -180, maximum: 180 },
    lat: { type: "number", minimum: -85.05112878, maximum: 85.05112878 },
    timestamp: { type: "number", minimum: 1633345319 },
    radius: { type: "number", minimum: 1 },
    dateAdded: { type: "number" },
  },
  nullable: true,
  additionalProperties: false,
};


export const itemType = {
  type: "object",
  $id: "itemType",
  required: ["id"],
  properties: {
    id: { type: "string" },
    type: { type: "string" },
    collectedAt: { type: "number", minimum: 1633345319 },
  },
  //additionalProperties: false
};
*/

// TODO finalize type
export const userType = {
  type: "object",
  $id: "userType",
  required: ["userName", "id"],
  properties: {
    id: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    externalUserId: {
      $ref: "externalUserIdType",
    },
    userName: { type: "string", minLength: 3, maxLength: 50 },
    password: { type: "string" },
    logo: { type: "string" },
    location: { $ref: "locationType" },
    latestLocations: { type: "array", items: { $ref: "locationType" } },
    friends: { type: "array", items: { $ref: "friendType" } },
    /*zones: {
      $ref: "zoneType",
    },*/
    createdAt: { type: "number", nullable: true },
    updatedAt: { type: "number", nullable: true },
  },
  additionalProperties: false,
};

// TODO finalize type
export const userUpdateType = {
  type: "object",
  $id: "userUpdateType",
  required: [],
  properties: {},
  additionalProperties: true,
};

export const userSignInType = {
  type: "object",
  $id: "userType",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    password: { type: "string" },
  },
  additionalProperties: false,
};
