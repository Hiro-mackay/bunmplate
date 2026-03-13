import { createApp } from "./bootstrap/app.ts";
import { closeDatabase, getDatabase } from "./shared/config/database.ts";
import { loadEnv } from "./shared/config/env.ts";
import { ConsoleLogger } from "./shared/infrastructure/consoleLogger.ts";
import { Cuid2IdGenerator } from "./shared/infrastructure/cuid2IdGenerator.ts";
import { RealDateProvider } from "./shared/infrastructure/realDateProvider.ts";

const env = loadEnv();
const logger = new ConsoleLogger();

const db = getDatabase({
  url: env.DATABASE_URL,
  poolSize: env.DATABASE_POOL_SIZE,
  idleTimeout: env.DATABASE_IDLE_TIMEOUT,
});
const idGenerator = new Cuid2IdGenerator();
const dateProvider = new RealDateProvider();

const app = createApp({
  db,
  jwtSecret: env.JWT_SECRET,
  idGenerator,
  dateProvider,
  logger,
  corsOrigin: env.CORS_ORIGIN,
});

app.listen(env.SERVER_PORT);

logger.info(`Server started on port ${env.SERVER_PORT}`);

async function gracefulShutdown() {
  logger.info("Shutting down gracefully...");
  app.stop();
  await closeDatabase();
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
