import { AppError } from "@server/shared/kernel/appError.ts";
import { unwrap } from "@server/shared/kernel/result.ts";
import { createHashedPassword } from "../../domain/valueObjects/hashedPassword.ts";
import { createPlainPassword } from "../../domain/valueObjects/plainPassword.ts";
import type { AuthResponseDto, LoginUserDto } from "../dtos.ts";
import type { IPasswordHasher } from "../ports/passwordHasher.port.ts";
import type { ITokenProvider } from "../ports/tokenProvider.port.ts";
import type { IUserRepository } from "../ports/userRepository.port.ts";

interface Deps {
  userRepository: IUserRepository;
  passwordHasher: IPasswordHasher;
  tokenProvider: ITokenProvider;
}

export async function loginUser(dto: LoginUserDto, deps: Deps): Promise<AuthResponseDto> {
  const password = unwrap(createPlainPassword(dto.password));

  const user = await deps.userRepository.findByEmail(dto.email);
  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const hashed = createHashedPassword(user.password);
  const valid = await deps.passwordHasher.verify(password, hashed);
  if (!valid) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const token = await deps.tokenProvider.sign({ userId: user.id });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
}
