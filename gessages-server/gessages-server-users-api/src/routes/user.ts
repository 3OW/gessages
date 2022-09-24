import { FastifyPluginAsync } from "fastify";
import schemas = require("../schemas/users");
import { hashPassword } from "../services/passwordHandling";

interface UserId {
  userId: string;
}

interface UserBodyPost {
  id: string;
  password: string;
  createdAt: number;
}

interface UserBodySignIn {
  id: string;
  password: string;
}

interface UserBodyPlain {
  id: string;
}

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Params: UserId }>(
    "/user/:userId",
    { schema: schemas.getUserById },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (
          request.params &&
          typeof request.params == "object" &&
          request.params != null
        ) {
          // check authorization
          try {
            await request.jwtVerify();
          } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ status: "jwt verify error" });
          }
          if (
            typeof request.user == "object" &&
            request.user != null &&
            "uid" in request.user
          ) {
            if (request.user["uid"] != request.params.userId) {
              return reply.code(401).send({ error: "not authorized" });
            }
          }
          let result;
          try {
            result = await redis.call("JSON.GET", [
              "usr-" + request.params.userId,
            ]);
          } catch (err: any) {
            return reply.code(500).send(err.message);
          }
          if (result != null && typeof result === "string") {
            return reply
              .status(200)
              .header("Content-Type", "application/json")
              .send(JSON.parse(result));
          } else {
            return reply.status(404).send({ status: "user not found" });
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
            return reply.status(409).send({ status: "user already exists" });
          }

          // Hash password
          const hashedPW = await hashPassword(body.password);
          if (hashedPW === null) {
            reply
              .status(404)
              .send({ status: "Create User failed: Password problem" });
          } else body.password = hashedPW;

          Object.assign(body, { createdAt: Date.now() });
          Object.assign(body, { updatedAt: body.createdAt });
          const multi = redis.multi();
          multi.call("JSON.SET", id, ".", JSON.stringify(body));

          await multi.exec((err: any, results: any) => {
            for (let i = 0; i < results.length; i += 1) {
              if (results[i][1] != "OK" && results[i][1] != 1) {
                return reply.status(404).send({ status: "Create User failed" });
              }
            }
            return reply
              .header("Content-Type", "application/json")
              .status(201)
              .send(err || { id: body.id });
          });
        } else {
          return reply.status(500).send({ status: "something went wrong" });
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ status: "internal error" });
      }
    }
  );

  fastify.delete<{ Params: UserId }>(
    "/user/:userId",
    { schema: schemas.deleteUser },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (
          request.params &&
          typeof request.params == "object" &&
          request.params != null
        ) {
          // check authorization
          try {
            await request.jwtVerify();
          } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ status: "jwt verify error" });
          }
          if (
            typeof request.user == "object" &&
            request.user != null &&
            "uid" in request.user
          ) {
            if (request.user["uid"] != request.params.userId) {
              return reply.code(401).send({ error: "not authorized" });
            }
          }
          let result = null;
          result = await redis.call("JSON.DEL", [
            "usr-" + request.params.userId,
          ]);
          if (result == 1) {
            return reply.status(200).send({ status: "success" });
          } else if (result == 0) {
            return reply.status(404).send({ status: "user not found" });
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

  fastify.put<{ Params: UserId }>(
    "/user/:userId",
    { schema: schemas.updateUser },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (
          typeof request.body == "object" &&
          request.body != null &&
          request.params &&
          typeof request.params == "object" &&
          request.params != null
        ) {
          // check authorization
          try {
            await request.jwtVerify();
          } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ status: "jwt verify error" });
          }
          if (
            typeof request.user == "object" &&
            request.user != null &&
            "uid" in request.user
          ) {
            if (request.user["uid"] != request.params.userId) {
              return reply.code(401).send({ error: "not authorized" });
            }
          }
          const body = request.body;
          const id = "usr-" + request.params.userId;
          let test = "";
          try {
            test = <string>await redis.call("JSON.GET", [id, ".password"]);
          } catch (err: any) {
            return reply.code(404).send(err.message);
          }
          if (test == null) {
            return reply.status(403).send({
              status: "user doesn't exists",
            });
          }
          Object.assign(body, { updatedAt: Date.now() });
          const multi = redis.multi();

          for (const [key, value] of Object.entries(body)) {
            if (key != "password") {
              multi.call("JSON.SET", [id, key, JSON.stringify(value)]);
            } else {
              const hash = await hashPassword(value);
              if (hash != null) {
                multi.call("JSON.SET", [id, key, JSON.stringify(hash), "XX"]);
              }
            }
          }
          //store the new document in Redis
          await multi.exec((err: any, results: any) => {
            console.log(results);
            // check if Redis Multi returns errors
            for (let i = 0; i < results.length; i += 1) {
              if (results[i][1] == null) {
                return reply.status(404).send({ status: "user update failed" });
              }
            }
            return reply.send(
              err || { status: results, id: request.params.userId }
            );
          });
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

export default user;
