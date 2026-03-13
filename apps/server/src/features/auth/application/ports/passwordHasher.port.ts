import type { HashedPassword } from "../../domain/valueObjects/hashedPassword.ts";
import type { PlainPassword } from "../../domain/valueObjects/plainPassword.ts";

export interface IPasswordHasher {
  hash(password: PlainPassword): Promise<HashedPassword>;
  verify(plain: PlainPassword, hashed: HashedPassword): Promise<boolean>;
}
