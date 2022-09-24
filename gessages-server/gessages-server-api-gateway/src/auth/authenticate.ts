import { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";

/**
 * Checks if the JWT token is valid
 */

export const authPlainToken: preHandlerHookHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
};

/**
 * Checks if the JWT token is valid and if the payload equals the userId request params
 */
export const authPutUser: preHandlerHookHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
    if (
      typeof request.user == "object" &&
      request.user != null &&
      "id" in request.user &&
      typeof request.params == "object" &&
      request.params != null
    ) {
      if (
        request.user["id"] !=
        "usr-" + Object.entries(request.params).at(0)?.[1]
      ) {
        throw Error("not authorized");
      }
    } else throw Error("not authorized");
  } catch (err) {
    reply.send(err);
  }
};
