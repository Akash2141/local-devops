import { liveCheck, readyCheck } from "../controllers/health-check";

const readyCheckOpts = {
  handler: readyCheck,
};

const liveCheckOpts = {
  handler: liveCheck,
};

const healthCheckRoutes = (fastify: any, _: any, done: any) => {
  fastify.get("/ready-check", readyCheckOpts);
  fastify.get("/live-check", liveCheckOpts);

  done();
};

export default healthCheckRoutes;
