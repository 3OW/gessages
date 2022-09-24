"use strict";

//TODO: check proper validation of all schemas
export const userSignInType = {
  type: "object",
  $id: "userType",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      minLength: 7,
      maxLength: 25,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
    password: { type: "string" },
  },
  additionalProperties: false,
};
