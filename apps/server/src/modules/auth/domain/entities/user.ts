import type { AppError } from "@server/shared/kernel/appError.ts";
import type { Result } from "@server/shared/kernel/result.ts";
import { ok } from "@server/shared/kernel/result.ts";
import type { Email } from "../valueObjects/email.ts";
import { createEmail } from "../valueObjects/email.ts";
import { HashedPassword } from "../valueObjects/hashedPassword.ts";

export interface User {
  readonly id: string;
  readonly email: Email;
  readonly password: HashedPassword;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export async function User(params: {
  id: string;
  email: string;
  password: string;
  now: Date;
}): Promise<Result<User, AppError>> {
  const emailResult = createEmail(params.email);
  if (!emailResult.ok) return emailResult;

  const passwordResult = await HashedPassword.hash(params.password);
  if (!passwordResult.ok) return passwordResult;

  return ok({
    id: params.id,
    email: emailResult.value,
    password: passwordResult.value,
    createdAt: params.now,
    updatedAt: params.now,
  });
}
