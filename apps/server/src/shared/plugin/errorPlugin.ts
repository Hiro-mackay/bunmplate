import { Elysia } from "elysia";
import type { ILogger } from "../application/logger.port.ts";
import { AppError } from "../kernel/appError.ts";

export function createErrorPlugin(logger: ILogger) {
  return new Elysia({ name: "error-plugin" }).onError(({ code, error, set }) => {
    const requestId = (set.headers["x-request-id"] as string) ?? undefined;

    if (code === "VALIDATION") {
      set.status = 400;
      const validationError = error as unknown as {
        all: ReadonlyArray<{ path: string; message: string; summary?: string }>;
      };
      const details = validationError.all.map((e) => ({
        path: e.path,
        message: e.message,
        ...(e.summary ? { summary: e.summary } : {}),
      }));
      logger.warn("Validation error", { requestId, details });
      return {
        error: {
          code: "VALIDATION_ERROR" as const,
          message: "Validation failed",
          details,
        },
      };
    }

    if (error instanceof AppError) {
      set.status = error.statusCode;
      const level = error.statusCode >= 500 ? "error" : "warn";
      logger[level](error.message, { requestId, code: error.code });
      return {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      };
    }

    set.status = 500;
    const stack = error instanceof Error ? error.stack : undefined;
    logger.error("Unhandled error", { requestId, stack });
    return {
      error: {
        code: "INTERNAL_ERROR" as const,
        message: "An unexpected error occurred",
      },
    };
  });
}
