import { FastifyPluginAsync } from "fastify";
import schemas = require("../schemas/signIn");
import { comparePassword } from "../services/passwordHandling";

interface UserBodySignIn {
  id: string;
  password: string;
}

/**
 * Login with username and password
 * returns { auth, jwt, userId }
 */
const signin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/signin/",
    { schema: schemas.signIn },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (typeof request.body == "object" && request.body != null) {
          let hash = "";
          const body = <UserBodySignIn>request.body;
          const id = "usr-" + body.id;
          try {
            hash = <string>await redis.call("JSON.GET", [id, ".password"]);
          } catch (err: any) {
            return reply.code(404).send(err.message);
          }
          if (hash == null) {
            return reply.status(403).send({
              success: true,
              status: "user doesn't exists",
            });
          }
          // Compare password
          if (hash != "") {
            if (await comparePassword(body.password, hash.slice(1, -1))) {
              const uid = body.id;
              const token = fastify.jwt.sign({ uid });
              return reply
                .header("Content-Type", "application/json")
                .status(201)
                .send({ auth: true, jwt: token, userId: body.id });
            } else
              return reply
                .header("Content-Type", "application/json")
                .status(403)
                .send({ auth: false });
          } else {
            return reply.status(500).send({ status: "something went wrong" });
          }
        } else {
          return reply.status(500).send({ status: "something went wrong" });
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ status: "internal error" });
      }
    }
  );
};

export default signin;
