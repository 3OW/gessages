"use strict";

import { userSignInType } from "./commonTypes";

export const signIn = {
  body: userSignInType,
  response: {
    200: {
      type: "object",
      properties: {
        auth: { type: "boolean" },
      },
      additionalProperties: true,
    },
    403: {
      type: "object",
      properties: {
        auth: { type: "boolean" },
      },
    },
  },
};

module.exports = {
  signIn,
};
