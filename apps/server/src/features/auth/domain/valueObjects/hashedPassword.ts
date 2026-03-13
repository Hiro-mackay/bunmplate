import type { Brand } from "@server/shared/kernel/brand.ts";

export type HashedPassword = Brand<string, "HashedPassword">;

export function createHashedPassword(value: string): HashedPassword {
  return value as HashedPassword;
}
