"use strict";
import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { USERS, MESSAGES, SECRET } from "./config";
import fastifyHttpProxy from "@fastify/http-proxy";
import fastifyJwt from "@fastify/jwt";
import { authPlainToken } from "./auth/authenticate";
import Redis from "@fastify/redis";
import {
  DEFAULT_DB_HOST,
  DEFAULT_DB_PASS,
  DEFAULT_DB_PORT,
  DEFAULT_DB_USER,
} from "./config";
import { userSignInType } from "./schemas/commonTypes";

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

const users = process.env.USERS || USERS;
const messages = process.env.MESSAGES || MESSAGES;
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

  fastify.addSchema(userSignInType);

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

  fastify.decorate("authenticate", authPlainToken);

  fastify.register(cors, {
    // put your options here
  });

  fastify.register(
    helmet
    // config here
  );

  fastify.register(fastifyHttpProxy, {
    upstream: `${messages}/thread/`,
    prefix: "/thread", // optional
    http2: false, // optional
    httpMethods: ["DELETE", "GET", "POST", "PUT"],
    preHandler: authPlainToken,
  });

  fastify.register(fastifyHttpProxy, {
    upstream: `${messages}/message/`,
    prefix: "/message", // optional
    http2: false, // optional
    httpMethods: ["DELETE", "GET", "POST", "PUT"],
    preHandler: authPlainToken,
  });

  fastify.register(fastifyHttpProxy, {
    upstream: `${users}/user/`,
    prefix: "/user", // optional
    http2: false, // optional
    httpMethods: ["DELETE", "GET", "PUT"],
    preHandler: authPlainToken,
  });

  fastify.register(fastifyHttpProxy, {
    upstream: `${users}/signup/`,
    prefix: "/signup", // optional
    http2: false, // optional
    httpMethods: ["POST"],
    // signUp doesn't need auth
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app };
