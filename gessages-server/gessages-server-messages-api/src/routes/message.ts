import { UnknownError } from "@fastify/sensible/lib/httpError";
import { FastifyPluginAsync } from "fastify";
import { nanoid } from "nanoid/async";
import { THREAD_EXPIRE } from "../config";
import schemas = require("../schemas/message");

interface ThreadId {
  thdId: string;
}

interface MessageId {
  thdId: string;
  msgId: string;
}
interface MessageBody {
  id: string;
  //threadId: string;
  createdAt: number;
}

// TODO create an index over all messages to RUD them directly without need of the threadId
const message: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Params: MessageId }>(
    "/message/:thdId/:msgId",
    { schema: schemas.getMessage },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (
          request.params &&
          typeof request.params == "object" &&
          request.params != null
        ) {
          let result;
          try {
            result = await redis.call("JSON.GET", [
              request.params.thdId,
              ".messages." + request.params.msgId,
            ]);
          } catch (err: unknown) {
            if (typeof err == "object" && err != null && "message" in err) {
              //TODO rework
              return reply.code(404).send(Object.entries(err).at(0)?.[1]);
            }
          }
          if (result != null && typeof result === "string") {
            return reply
              .status(200)
              .header("Content-Type", "application/json")
              .send(JSON.parse(result));
          } else {
            reply.status(404).send({ error: "message not found" });
          }
        } else {
          return reply.status(500).send({ error: "something went wrong" });
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "internal error" });
      }
    }
  );

  fastify.post<{ Params: ThreadId }>(
    "/message/:thdId",
    { schema: schemas.postMessage },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        // extract userId from JWT token
        try {
          await request.jwtVerify();
        } catch (err) {
          fastify.log.error(err);
          return reply.status(500).send({ error: "jwt verify error" });
        }
        if (
          !(
            typeof request.user == "object" &&
            request.user != null &&
            "uid" in request.user
          )
        ) {
          return reply.status(500).send({ error: "no userid in JWT" });
        }
        if (typeof request.body == "object" && request.body != null) {
          const body = <MessageBody>request.body;
          const id = "msg-" + (await nanoid());
          Object.assign(body, { userId: request.user["uid"] });
          Object.assign(body, { id: id });
          Object.assign(body, { threadId: request.params.thdId });
          Object.assign(body, { createdAt: Date.now() });
          Object.assign(body, { updatedAt: body.createdAt });
          const multi = redis.multi();
          multi.call("JSON.SET", [
            request.params.thdId,
            ".messages." + id,
            JSON.stringify(body),
          ]);
          // update thready expire
          multi.expire(request.params.thdId, THREAD_EXPIRE);

          await multi.exec((err: any, results: any) => {
            if (results[1][1] == "0") {
              return reply.status(404).send({ error: "Thread not found" });
            }
            return reply.status(201).send(err || { id: id });
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

  fastify.delete<{ Params: MessageId }>(
    "/message/:thdId/:msgId",
    { schema: schemas.deleteMessage },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (
          request.params &&
          typeof request.params == "object" &&
          request.params != null
        ) {
          // check authorization
          let tmp;
          try {
            tmp = <string>(
              await redis.call("JSON.GET", [
                request.params.thdId,
                ".messages." + request.params.msgId + ".userId",
              ])
            );
          } catch (err: any) {
            if (err.message && err.message.slice(0, 8) == "ERR Path") {
              return reply
                .status(404)
                .header("Content-Type", "application/json")
                .send({ error: "message not found" });
            } else return reply.code(500).send({ error: err.message });
          }
          if (tmp == null) {
            return reply
              .status(404)
              .header("Content-Type", "application/json")
              .send({ error: "message not found" });
          }
          try {
            await request.jwtVerify();
          } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "jwt verify error" });
          }
          if (
            typeof request.user == "object" &&
            request.user != null &&
            "uid" in request.user
          ) {
            if (request.user["uid"] != tmp.slice(1, -1)) {
              return reply.code(401).send({ error: "not authorized" });
            }
          }
          let result = null;
          result = await redis.call("JSON.DEL", [
            request.params.thdId,
            ".messages." + request.params.msgId,
          ]);
          if (result == 1) {
            return reply.status(200).send({ status: "success" });
          } else {
            return reply.status(500).send({ error: "something went wrong" });
          }
        } else {
          return reply.status(500).send({ error: "something went wrong" });
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "internal error" });
      }
    }
  );

  // SHould Thread Expire be reset on change? and Thread updatedAt be changed?
  fastify.put<{ Params: MessageId }>(
    "/message/:thdId/:msgId",
    { schema: schemas.updateMessage },
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
          let tmp;
          try {
            tmp = <string>(
              await redis.call("JSON.GET", [
                request.params.thdId,
                ".messages." + request.params.msgId + ".userId",
              ])
            );
          } catch (err: any) {
            if (err.message && err.message.slice(0, 8) == "ERR Path") {
              return reply
                .status(404)
                .header("Content-Type", "application/json")
                .send({ error: "message not found" });
            } else return reply.code(500).send(err.message);
          }
          if (tmp == null) {
            return reply
              .status(404)
              .header("Content-Type", "application/json")
              .send({ error: "message not found" });
          }
          try {
            await request.jwtVerify();
          } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "jwt verify error" });
          }
          if (
            typeof request.user == "object" &&
            request.user != null &&
            "uid" in request.user
          ) {
            if (request.user["uid"] != tmp.slice(1, -1)) {
              return reply.code(401).send({ error: "not authorized" });
            }
          }
          const body = request.body;
          Object.assign(body, { updatedAt: Date.now() });
          const multi = redis.multi();

          for (const [key, value] of Object.entries(body)) {
            if (key == "userId") continue;
            multi.call("JSON.SET", [
              request.params.thdId,
              ".messages." + request.params.msgId + "." + key,
              JSON.stringify(value),
            ]);
          }
          //store the new document in Redis
          await multi.exec((err: any, results: any) => {
            // check if Redis Multi returns errors
            for (let i = 0; i < results.length; i += 1) {
              if (results[i][1] == null) {
                return reply
                  .status(404)
                  .send({ error: "message update failed" });
              }
            }
            return reply.send(
              err || { status: results, id: request.params.msgId }
            );
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

export default message;
