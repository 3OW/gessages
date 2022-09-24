"use strict";

import { MSG_MAX_LENGTH, MSG_MIN_LENGTH } from "../config";

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

export const messageType = {
  type: "object",
  $id: "messageType",
  required: ["userId", "threadId", "location", "message"],
  properties: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^msg-" },
    userId: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    userName: { type: "string" },
    userLogo: { type: "string" },
    parentId: { type: "string", nullable: true },
    threadId: { type: "string", nullable: true },
    location: { $ref: "locationType" },
    message: {
      type: "string",
      minLength: MSG_MIN_LENGTH,
      maxLength: MSG_MAX_LENGTH,
    },
    images: {
      type: "array",
      nullable: true,
      items: { type: "string" },
    },
    createdAt: { type: "number", nullable: true },
    updatedAt: { type: "number", nullable: true },
  },
  additionalProperties: false,
};

export const messageUpdateType = {
  type: "object",
  $id: "messageUpdateType",
  required: [],
  properties: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
    userId: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    userName: { type: "string" },
    userLogo: { type: "string" },
    parentId: { type: "string", nullable: true },
    threadId: { type: "string", nullable: true },
    location: { $ref: "locationType" },
    message: {
      type: "string",
      minLength: MSG_MIN_LENGTH,
      maxLength: MSG_MAX_LENGTH,
    },
    images: {
      type: "array",
      nullable: true,
      items: { type: "string" },
    },
    createdAt: { type: "number", nullable: true },
    updatedAt: { type: "number", nullable: true },
  },
  additionalProperties: false,
};

export const threadType = {
  type: "object",
  $id: "threadType",
  required: ["userId", "location", "message"],
  properties: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
    userId: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    userName: { type: "string" },
    userLogo: { type: "string" },
    zoneId: { type: "string", nullable: true },
    location: { $ref: "locationType" },
    message: {
      type: "string",
      minLength: MSG_MIN_LENGTH,
      maxLength: MSG_MAX_LENGTH,
    },
    messages: {
      type: "object",
      nullable: true,
      patternProperties: {
        "^msg.*$": {
          $ref: "messageType",
        },
      },
      additionalProperties: false,
    },
    images: {
      type: "array",
      nullable: true,
      items: { type: "string" },
    },
    createdAt: { type: "number", nullable: true },
    updatedAt: { type: "number", nullable: true },
  },
  additionalProperties: false,
};

export const threadUpdateType = {
  type: "object",
  $id: "threadUpdateType",
  required: [],
  properties: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
    userId: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    userName: { type: "string" },
    userLogo: { type: "string" },
    zoneId: { type: "string", nullable: true },
    location: { $ref: "locationType" },
    message: {
      type: "string",
      minLength: MSG_MIN_LENGTH,
      maxLength: MSG_MAX_LENGTH,
    },
    messages: {
      type: "object",
      nullable: true,
      patternProperties: {
        "^msg.*$": {
          $ref: "messageType",
        },
      },
      additionalProperties: false,
    },
    images: {
      type: "array",
      nullable: true,
      items: { type: "string" },
    },
    createdAt: { type: "number", nullable: true },
    updatedAt: { type: "number", nullable: true },
  },
  additionalProperties: false,
};

export const threadOnlyType = {
  type: "object",
  $id: "threadOnlyType",
  required: ["userId", "location", "message"],
  properties: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
    userId: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    userName: { type: "string" },
    userLogo: { type: "string" },
    zoeId: { type: "string", nullable: true },
    location: { $ref: "locationType" },
    message: {
      type: "string",
      minLength: MSG_MIN_LENGTH,
      maxLength: MSG_MAX_LENGTH,
    },
    images: {
      type: "array",
      nullable: true,
      items: { type: "string" },
    },
    createdAt: { type: "number", nullable: true },
    updatedAt: { type: "number", nullable: true },
  },
  additionalProperties: false,
};
