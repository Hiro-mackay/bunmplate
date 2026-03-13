import { Elysia } from "elysia";
import { jwtVerify } from "jose";
import { AppError } from "../kernel/appError.ts";

export interface AuthPayload {
  userId: string;
}

export function createAuthGuard(jwtSecret: string) {
  const secret = new TextEncoder().encode(jwtSecret);

  return new Elysia({ name: "auth-guard" }).resolve(
    { as: "scoped" },
    async ({ headers }): Promise<{ auth: AuthPayload }> => {
      const authorization = headers.authorization;
      if (!authorization?.startsWith("Bearer ")) {
        throw AppError.unauthorized("Missing or invalid authorization header");
      }

      const token = authorization.slice(7);

      try {
        const { payload } = await jwtVerify(token, secret);
        if (typeof payload.sub !== "string") {
          throw AppError.unauthorized("Invalid token payload");
        }
        return { auth: { userId: payload.sub } };
      } catch (e) {
        if (e instanceof AppError) throw e;
        throw AppError.unauthorized("Invalid or expired token");
      }
    },
  );
}
