import buildFastifyApp from "./app";
import { DB_PASSWORD, ENVIRONMENT, HOST, PORT } from "./config";
console.log("process.env::",process.env);
async function main() {
  try {
    const fastifyApp = await buildFastifyApp();
    fastifyApp.listen({ port: PORT, host: HOST }, async () => {
      console.log("server started on:", HOST, PORT, ENVIRONMENT, DB_PASSWORD);
    });
  } catch (err) {
    // console.log("Failed to initialize Fastify server ...");
    console.log(err);
  }
}

// Run the application
main();
