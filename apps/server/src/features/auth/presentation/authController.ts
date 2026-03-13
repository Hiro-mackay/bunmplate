import type { TransactionPlugin } from "@server/shared/plugin/transactionPlugin.ts";
import { Elysia, t } from "elysia";
import { loginUser } from "../application/useCases/loginUser.ts";
import { registerUser } from "../application/useCases/registerUser.ts";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../domain/valueObjects/plainPassword.ts";
import { type AuthConfig, createAuthDeps } from "../ioc.ts";

export function authController(txPlugin: TransactionPlugin, config: AuthConfig) {
  return new Elysia({ prefix: "/auth" })
    .use(txPlugin)
    .resolve(({ tx }) => ({ deps: createAuthDeps(tx, config) }))
    .post("/signup", ({ body, deps }) => registerUser(body, deps), {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({
          minLength: PASSWORD_MIN_LENGTH,
          maxLength: PASSWORD_MAX_LENGTH,
        }),
      }),
    })
    .post("/login", ({ body, deps }) => loginUser(body, deps), {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    });
}
