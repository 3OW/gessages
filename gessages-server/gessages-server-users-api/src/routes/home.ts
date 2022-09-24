import { FastifyPluginAsync } from "fastify";
import { DEFAULT_PORT } from "../config";

const Port = process.env.PORT || DEFAULT_PORT;

const home: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", async (request, reply) => {
    await reply.send (`Up and running on Port ${Port}`);
  });
};

export default home;