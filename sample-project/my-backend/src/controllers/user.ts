import { FastifyReply, FastifyRequest } from "fastify";
import * as UserService from "./../services/user";

interface CreateUserRequestBody {
  id?: string;
  name: string;
}

export const createUser = async (
  req: FastifyRequest<{
    Body: CreateUserRequestBody;
  }>,
  reply: FastifyReply
) => {
  const userDetail = req.body;
  const response = UserService.createUser(userDetail);
  return reply.send(response.result).status(response.code);
};

export const getUsers = async (
  req: FastifyRequest<{
    Body: any;
  }>,
  reply: FastifyReply
) => {
  const response = UserService.getUsers();
  return reply.send(response.result).status(response.code);
};

export const getUser = async (
  req: FastifyRequest<{
    Body: any;
  }>,
  reply: FastifyReply
) => {
  const response = UserService.getUsersById(23);
  return reply.send(response.result).status(response.code);
};

export const updateUser = async (
  req: FastifyRequest<{
    Body: any;
  }>,
  reply: FastifyReply
) => {
  const response = UserService.updateUser();
  return reply.send(response.result).status(response.code);
};

export const deleteUser = async (
  req: FastifyRequest<{
    Body: any;
  }>,
  reply: FastifyReply
) => {
  const response = UserService.deleteUser();
  return reply.send(response.result).status(response.code);
};
