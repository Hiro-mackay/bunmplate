import { AppError } from "@server/shared/kernel/appError.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 256;

export class HashedPassword {
  readonly #value: string;

  private constructor(value: string) {
    this.#value = value;
  }

  static async hash(plain: string): Promise<Result<HashedPassword, AppError>> {
    if (plain.length < PASSWORD_MIN_LENGTH) {
      return err(
        AppError.validation(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
      );
    }
    if (plain.length > PASSWORD_MAX_LENGTH) {
      return err(AppError.validation(`Password must be at most ${PASSWORD_MAX_LENGTH} characters`));
    }
    const hashed = await Bun.password.hash(plain);
    return ok(new HashedPassword(hashed));
  }

  static fromHashed(value: string): HashedPassword {
    return new HashedPassword(value);
  }

  async verify(plain: string): Promise<boolean> {
    return Bun.password.verify(plain, this.#value);
  }

  get value(): string {
    return this.#value;
  }
}
