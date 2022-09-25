"use strict";

import { userType, userUpdateType, userSignInType } from "./commonTypes";

export const getUserById = {
  tags: ["user"],
  params: {
    id: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
  },
  response: {
    200: userType,
    204: {
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
    405: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
export const createUser = {
  body: userType,
  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      additionalProperties: true,
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
    409: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const deleteUser = {
  params: {
    id: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
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
  },
};

export const updateUser = {
  params: {
    id: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
  },
  body: userUpdateType,
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
  },
};

export const getUserProperties = {
  params: {
    id: {
      type: "string",
      minLength: 3,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    properties: { type: "string" },
  },
  response: {
    200: userType,
    204: {
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
    405: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

module.exports = {
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  getUserProperties,
};
