import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user";

const createUserOpts = {
  handler: createUser,
};

const getUserOpts = {
  handler: getUser,
};

const getUsersOpts = {
  handler: getUsers,
};

const updateUserOpts = {
  handler: updateUser,
};

const deleteUserOpts = {
  handler: deleteUser,
};

const userRoutes = (fastify: any, _: any, done: any) => {
  fastify.post("/create/user", createUserOpts);
  fastify.patch("/update/user", updateUserOpts);
  fastify.get("/get/user", getUserOpts);
  fastify.get("/get/users", getUsersOpts);
  fastify.delete("/delete/user", deleteUserOpts);

  done();
};

export default userRoutes;
