"use strict";

import { messageType, messageUpdateType } from "./commonTypes";

export const getMessage = {
  params: {
    thdId: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
    msgId: { type: "string", minLength: 25, maxLength: 25, pattern: "^msg-" },
  },
  response: {
    200: messageType,
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

export const postMessage = {
  params: {
    thdId: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
  },
  body: messageType,
  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
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

export const deleteMessage = {
  params: {
    thdId: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
    msgId: { type: "string", minLength: 25, maxLength: 25, pattern: "^msg-" },
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

export const updateMessage = {
  params: {
    thdId: { type: "string", minLength: 25, maxLength: 25, pattern: "^thd-" },
    msgId: { type: "string", minLength: 25, maxLength: 25, pattern: "^msg-" },
  },
  body: messageUpdateType,
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
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

module.exports = {
  getMessage,
  postMessage,
  deleteMessage,
  updateMessage,
};
