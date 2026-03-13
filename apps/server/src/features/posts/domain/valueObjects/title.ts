import { AppError } from "@server/shared/kernel/appError.ts";
import type { Brand } from "@server/shared/kernel/brand.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";

export type Title = Brand<string, "Title">;

export const TITLE_MIN_LENGTH = 1;
export const TITLE_MAX_LENGTH = 200;

export function createTitle(value: string): Result<Title, AppError> {
  const trimmed = value.trim();
  if (trimmed.length < TITLE_MIN_LENGTH) {
    return err(AppError.validation("Title cannot be empty"));
  }
  if (trimmed.length > TITLE_MAX_LENGTH) {
    return err(AppError.validation(`Title must be at most ${TITLE_MAX_LENGTH} characters`));
  }
  return ok(trimmed as Title);
}
