import type { Database } from "@bunmplate/drizzle";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authController } from "../features/auth/presentation/authController.ts";
import { healthController } from "../features/health/presentation/healthController.ts";
import { postController } from "../features/posts/presentation/postController.ts";
import type { IDateProvider } from "../shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "../shared/application/idGenerator.port.ts";
import type { ILogger } from "../shared/application/logger.port.ts";
import { createAuthGuard } from "../shared/plugin/authGuard.ts";
import { createErrorPlugin } from "../shared/plugin/errorPlugin.ts";
import { requestIdPlugin } from "../shared/plugin/requestIdPlugin.ts";
import { securityHeadersPlugin } from "../shared/plugin/securityHeadersPlugin.ts";
import { createTransactionPlugin } from "../shared/plugin/transactionPlugin.ts";

interface AppDeps {
  db: Database;
  jwtSecret: string;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
  logger: ILogger;
  corsOrigin: string;
}

export function createApp(deps: AppDeps) {
  const txPlugin = createTransactionPlugin(deps.db);
  const authGuardPlugin = createAuthGuard(deps.jwtSecret);
  const sharedConfig = {
    idGenerator: deps.idGenerator,
    dateProvider: deps.dateProvider,
  };

  return new Elysia()
    .use(
      cors({
        origin: deps.corsOrigin,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PATCH", "DELETE"],
      }),
    )
    .use(securityHeadersPlugin)
    .use(requestIdPlugin)
    .use(createErrorPlugin(deps.logger))
    .use(healthController(deps.db))
    .use(authController(txPlugin, { jwtSecret: deps.jwtSecret, ...sharedConfig }))
    .use(postController(txPlugin, authGuardPlugin, sharedConfig));
}

export type App = ReturnType<typeof createApp>;
