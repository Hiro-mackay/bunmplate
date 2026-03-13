import { AppError } from "@server/shared/kernel/appError.ts";
import type { Brand } from "@server/shared/kernel/brand.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";

export type PlainPassword = Brand<string, "PlainPassword">;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function createPlainPassword(value: string): Result<PlainPassword, AppError> {
  if (value.length < PASSWORD_MIN_LENGTH) {
    return err(AppError.validation(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`));
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return err(AppError.validation(`Password must be at most ${PASSWORD_MAX_LENGTH} characters`));
  }
  return ok(value as PlainPassword);
}
