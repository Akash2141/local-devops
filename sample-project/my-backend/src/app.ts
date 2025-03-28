import fastify, { FastifyInstance } from "fastify";
import userRoutes from "./routes/user";
import healthCheckRoutes from "./routes/health-check";

const buildFastifyApp = async () => {
  const server: FastifyInstance = fastify({
    logger: false,
    bodyLimit: 30 * 1024 * 1024, // Default Limit set to 30MB
  });
  await server.register(healthCheckRoutes);
  await server.register(userRoutes);
  return server;
};

export default buildFastifyApp;
