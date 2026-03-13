import type { IPasswordHasher } from "../application/ports/passwordHasher.port.ts";
import {
  createHashedPassword,
  type HashedPassword,
} from "../domain/valueObjects/hashedPassword.ts";
import type { PlainPassword } from "../domain/valueObjects/plainPassword.ts";

export class BunPasswordHasher implements IPasswordHasher {
  async hash(password: PlainPassword): Promise<HashedPassword> {
    const hashed = await Bun.password.hash(password);
    return createHashedPassword(hashed);
  }

  async verify(plain: PlainPassword, hashed: HashedPassword): Promise<boolean> {
    return Bun.password.verify(plain, hashed);
  }
}
