import { FastifyReply, FastifyRequest } from "fastify";

export const readyCheck = async (
  req: FastifyRequest<{
    Body: any;
  }>,
  reply: FastifyReply
) => {
  return reply.send().status(200);
};

export const liveCheck = async (
  req: FastifyRequest<{
    Body: any;
  }>,
  reply: FastifyReply
) => {
  return reply.send().status(200);
};
