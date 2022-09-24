"use strict";

import { threadType, threadOnlyType, threadUpdateType } from "./commonTypes";

export const getThreadById = {
  params: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
  },
  response: {
    200: threadOnlyType,
    204: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
export const postThread = {
  body: threadType,
  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      additionalProperties: true,
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const deleteThread = {
  params: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const updateThread = {
  params: {
    id: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
  },
  body: threadUpdateType,
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
        id: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    405: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const getNearThreads = {
  params: {
    lon: { type: "number", minimum: -180, maximum: 180 },
    lat: { type: "number", minimum: -85.05112878, maximum: 85.05112878 },
    rad: { type: "number", minimum: 0.0001 },
    all: { type: "boolean" },
  },
  response: {
    200: threadOnlyType,
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

module.exports = {
  getThreadById,
  postThread,
  deleteThread,
  updateThread,
  getNearThreads,
};
