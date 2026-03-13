import { unwrapAsync } from "@server/shared/kernel/result.ts";
import { createRateLimitPlugin } from "@server/shared/plugin/rateLimitPlugin.ts";
import type { TransactionPlugin } from "@server/shared/plugin/transactionPlugin.ts";
import { Elysia, t } from "elysia";
import { loginUser } from "../application/useCases/loginUser.ts";
import { registerUser } from "../application/useCases/registerUser.ts";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../domain/valueObjects/hashedPassword.ts";
import { type AuthConfig, createAuthDeps } from "../ioc.ts";

const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX = 20;

export function authController(txPlugin: TransactionPlugin, config: AuthConfig) {
  return new Elysia({ prefix: "/auth" })
    .use(createRateLimitPlugin({ windowMs: AUTH_RATE_LIMIT_WINDOW_MS, max: AUTH_RATE_LIMIT_MAX }))
    .use(txPlugin)
    .resolve(({ tx }) => ({ deps: createAuthDeps(tx, config) }))
    .post("/signup", ({ body, deps }) => unwrapAsync(registerUser(body, deps)), {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({
          minLength: PASSWORD_MIN_LENGTH,
          maxLength: PASSWORD_MAX_LENGTH,
        }),
      }),
    })
    .post("/login", ({ body, deps }) => unwrapAsync(loginUser(body, deps)), {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    });
}
