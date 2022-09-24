"use strict";
import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import Redis from "@fastify/redis";
import {
  DEFAULT_DB_HOST,
  DEFAULT_DB_PASS,
  DEFAULT_DB_PORT,
  DEFAULT_DB_USER,
  SECRET,
} from "./config";
import {
  externalUserIdType,
  friendType,
  locationType,
  userType,
  userUpdateType,
} from "./schemas/commonTypes";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";

const DB = {
  host: process.env.DB_HOST || DEFAULT_DB_HOST,
  port: parseInt(process.env.DB_PORT) || DEFAULT_DB_PORT,
  username: process.env.DB_USER || DEFAULT_DB_USER || "default",
  password: process.env.DB_PASS || DEFAULT_DB_PASS || "",
  retryStrategy(times = 25) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};
const secret = process.env.SECRET || SECRET;

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  fastify.register(Redis, DB);

  fastify.addSchema(locationType);
  fastify.addSchema(externalUserIdType);
  fastify.addSchema(friendType);
  fastify.addSchema(userType);
  fastify.addSchema(userUpdateType);

  fastify.register(fastifyJwt, {
    secret: secret,
    sign: {
      algorithm: "HS512",
      expiresIn: "30d",
      aud: "user",
      iss: "gessages.tld",
    },

    verify: {
      allowedAud: "user",
      allowedIss: "gessages.tld",
      algorithms: ["HS512"],
    },
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  await fastify.register(fastifySwagger, {
    routePrefix: "/documentation",
    swagger: {
      info: {
        title: "Users API",
        description: "Users API endpoints",
        version: "0.1.0",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [
        { name: "user", description: "User related end-points" },
        { name: "code", description: "Code related end-points" },
      ],
      definitions: {
        User: {
          type: "object",
          required: ["id", "email"],
          properties: {
            id: { type: "string", format: "uuid" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
      },
    },
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  });
};

export default app;
export { app };
//
