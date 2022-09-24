import { FastifyPluginAsync } from "fastify";
import { nanoid } from "nanoid/async";
import { MAX_GEO_RESULTS, THREAD_EXPIRE } from "../config";
import { rsToJSONWithoutReturn, rsToJSONWithReturn } from "../services/toJSON";
import schemas = require("../schemas/thread");

interface ThreadId {
  id: `thd-${string}`;
}

interface GeoLoc {
  lat: number;
  lon: number;
  rad: number;
  all: boolean;
}
interface Location {
  lon: number;
  lat: number;
  timestamp: number;
}

interface ThreadBody {
  location: Location;
  // eslint-disable-next-line @typescript-eslint/ban-types
  messages: object; //TODO create interface
  createdAt: number;
}

const thread: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Params: ThreadId }>(
    "/thread/:id",
    { schema: schemas.getThreadById },
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
            result = await redis.call("JSON.GET", request.params.id);
          } catch (err: any) {
            return reply.code(500).send(err.message);
          }
          if (result != null && typeof result === "string") {
            return reply
              .status(200)
              .header("Content-Type", "application/json")
              .send(JSON.parse(result));
          } else {
            reply.status(404).send({ error: "thread not found" });
          }
        } else {
          return reply.status(500).send({ error: "something went wrong" });
        }
      } catch (err) {
        console.log(err);
        return reply.status(500).send({ error: "internal error" });
      }
    }
  );

  fastify.post(
    "/thread/",
    { schema: schemas.postThread },
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
          const body = <ThreadBody>request.body;
          const id = "thd-" + (await nanoid());
          Object.assign(body, { userId: request.user["uid"] });
          Object.assign(body, { id: id });
          Object.assign(body, { createdAt: Date.now() });
          Object.assign(body, { updatedAt: body.createdAt });
          if (!body.messages) Object.assign(body, { messages: {} });
          // create coordinates for geoIndex
          Object.assign(body, {
            geoIndex: body.location.lon + "," + body.location.lat,
          });

          //store the new document in Redis and set expire
          const multi = redis.multi();
          multi.call("JSON.SET", id, ".", JSON.stringify(body));
          multi.expire(id, THREAD_EXPIRE);
          //TODO: Proper error handling
          await multi.exec((err: any, results: any) => {
            for (let i = 0; i < results.length; i += 1) {
              if (results[i][1] != "OK" && results[i][1] != 1) {
                return reply.status(404).send({ error: "Post Thread failed" });
              }
            }
            return reply
              .header("Content-Type", "application/json")
              .status(201)
              .send(err || { id: id });
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

  fastify.delete<{ Params: ThreadId }>(
    "/thread/:id",
    { schema: schemas.deleteThread },
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
              await redis.call("JSON.GET", [request.params.id, ".userId"])
            );
          } catch (err: any) {
            return reply.code(500).send(err.message);
          }
          if (tmp == null) {
            return reply
              .status(404)
              .header("Content-Type", "application/json")
              .send({ error: "thread not found" });
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
          // delete thread
          let result = null;
          result = await redis.call("JSON.DEL", request.params.id);
          if (result == 1) {
            return reply
              .header("Content-Type", "application/json")
              .status(200)
              .send({ status: "success" });
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

  fastify.put<{ Params: ThreadId }>(
    "/thread/:id",
    { schema: schemas.updateThread },
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
              await redis.call("JSON.GET", [request.params.id, ".userId"])
            );
          } catch (err: any) {
            return reply.code(500).send(err.message);
          }
          if (tmp == null) {
            return reply
              .status(404)
              .header("Content-Type", "application/json")
              .send({ error: "thread not found" });
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
            if (String(key) == "messages") {
              return reply
                .status(405)
                .send({ error: "message updates are not allowed here" });
            }
            //prevent chaning the userId
            if (String(key) == "userId") {
              continue;
            }
            multi.call(
              "JSON.SET",
              request.params.id,
              "." + key,
              JSON.stringify(value)
            );
          }
          //store the new document in Redis
          await multi.exec((err: any, results: any) => {
            // check if Redis Multi returns errors
            for (let i = 0; i < results.length; i += 1) {
              if (results[i][1] != "OK") {
                return reply
                  .status(404)
                  .send({ error: "Thread update failed." });
              }
            }
            return reply.send(
              err || { status: results, id: request.params.id }
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
  // TODO proper typing
  fastify.get<{ Params: GeoLoc }>(
    "/thread/near/:lon/:lat/:rad/:all",
    { schema: schemas.getNearThreads },
    async (request, reply) => {
      try {
        const { redis } = fastify;
        if (
          request.params &&
          typeof request.params == "object" &&
          request.params != null
        ) {
          let result: Array<string> | null | unknown = null;

          if (request.params.all == true) {
            result = await redis.call(
              "FT.SEARCH",
              "geoIdx",
              `@geoIndex:[${request.params.lon} 
          ${request.params.lat} ${request.params.rad} km]`,
              "LIMIT",
              "0",
              MAX_GEO_RESULTS,
              (err, value) => {
                return value;
                // value === 'bar'
              }
            );
          } else {
            // Will only return results which have all "RETURN" parameters
            result = await redis.call(
              "FT.SEARCH",
              "geoIdx",
              `@geoIndex:[${request.params.lon} 
          ${request.params.lat} ${request.params.rad} km]`,
              "LIMIT",
              "0",
              MAX_GEO_RESULTS,
              "RETURN",
              "6",
              "$.id",
              "$.userId",
              "$.location",
              "$.message",
              "$.createdAt",
              "$.updatedAt"
            );
          }
          if (result == null) {
            return reply.status(500).send({ error: "query the db went wrong" });
          } else {
            if (request.params.all == true)
              reply
                .header("Content-Type", "application/json")
                // @ts-ignore:
                .send(JSON.stringify(rsToJSONWithoutReturn(result)));
            else
              return (
                reply
                  .header("Content-Type", "application/json")
                  // @ts-ignore:
                  .send(JSON.stringify(rsToJSONWithReturn(result)))
              );
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
};

export default thread;
