import { AppError } from "@server/shared/kernel/appError.ts";
import type { Brand } from "@server/shared/kernel/brand.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";

export type Email = Brand<string, "Email">;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createEmail(value: string): Result<Email, AppError> {
  const trimmed = value.trim().toLowerCase();
  if (!EMAIL_REGEX.test(trimmed)) {
    return err(AppError.validation(`Invalid email format: ${value}`));
  }
  return ok(trimmed as Email);
}
