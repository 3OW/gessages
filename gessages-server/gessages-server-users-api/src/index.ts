"use strict";
import App from "./app";
import pino from "pino";
import { DEFAULT_HOST, DEFAULT_LOG_LEVEL, DEFAULT_PORT } from "./config";
import Fastify from "fastify";
import fp from "fastify-plugin";

const server = Fastify({
  logger: pino({ level: process.env.LOGLEVEL || DEFAULT_LOG_LEVEL }),
});

const Port = parseInt(process.env.PORT) || DEFAULT_PORT;
const Host = process.env.HOST || DEFAULT_HOST;

const start = async () => {
  try {
    server.register(fp(App));
    await server.listen({ port: Port, host: Host });
    console.log(`Up and running on Port ${Port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();
