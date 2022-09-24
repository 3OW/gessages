"use strict";

import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import cors from "@fastify/cors";
import { FastifyPluginAsync } from "fastify";
import fastifyJwt from "@fastify/jwt";
import Redis from "@fastify/redis";
import {
  DEFAULT_DB_HOST,
  DEFAULT_DB_PASS,
  DEFAULT_DB_PORT,
  DEFAULT_DB_USER,
  SECRET,
} from "./config";
import {
  locationType,
  messageType,
  threadOnlyType,
  threadType,
} from "./schemas/commonTypes";

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
  fastify.register(Redis, DB);

  fastify.register(cors, {
    // put your options here
  });

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

  fastify.addSchema(locationType);
  fastify.addSchema(messageType);
  fastify.addSchema(threadType);
  fastify.addSchema(threadOnlyType);

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app };
