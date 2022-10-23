import { FastifyPluginAsync } from "fastify";
import schemas = require("../schemas/users");
import { hashPassword } from "../services/passwordHandling";

interface UserBodyPost {
  id: string;
  password: string;
  createdAt: number;
}

const signup: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/signup/",
    { schema: schemas.createUser },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (typeof request.body == "object" && request.body != null) {
          let result;
          const body = <UserBodyPost>request.body;
          const id = "usr-" + body.id;
          try {
            result = await redis.call("JSON.GET", [id]);
          } catch (err: any) {
            return reply.code(404).send(err.message);
          }
          if (result != null) {
            return reply.status(409).send({ error: "user already exists" });
          }

          // Hash password
          const hashedPW = await hashPassword(body.password);
          if (hashedPW === null) {
            reply
              .status(404)
              .send({ error: "Create User failed: Password problem" });
          } else body.password = hashedPW;

          Object.assign(body, { createdAt: Date.now() });
          Object.assign(body, { updatedAt: body.createdAt });
          const multi = redis.multi();
          multi.call("JSON.SET", id, ".", JSON.stringify(body));

          await multi.exec((err: any, results: any) => {
            for (let i = 0; i < results.length; i += 1) {
              if (results[i][1] != "OK" && results[i][1] != 1) {
                return reply.status(404).send({ error: "Create User failed" });
              }
            }
            return reply
              .header("Content-Type", "application/json")
              .status(201)
              .send({ id: body.id });
          });
        } else {
          return reply.status(500).send({ error: "something went wrong" });
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "internal error" });
      }
    }
  );
};

export default signup;
