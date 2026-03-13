import { AppError } from "@server/shared/kernel/appError.ts";
import type { Brand } from "@server/shared/kernel/brand.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";

export type Content = Brand<string, "Content">;

export const CONTENT_MIN_LENGTH = 1;
export const CONTENT_MAX_LENGTH = 10000;

export function createContent(value: string): Result<Content, AppError> {
  const trimmed = value.trim();
  if (trimmed.length < CONTENT_MIN_LENGTH) {
    return err(AppError.validation("Content cannot be empty"));
  }
  if (trimmed.length > CONTENT_MAX_LENGTH) {
    return err(AppError.validation(`Content must be at most ${CONTENT_MAX_LENGTH} characters`));
  }
  return ok(trimmed as Content);
}
