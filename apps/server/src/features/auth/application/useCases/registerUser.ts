import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import { AppError } from "@server/shared/kernel/appError.ts";
import { unwrap } from "@server/shared/kernel/result.ts";
import type { User } from "../../domain/entities/user.ts";
import { createEmail } from "../../domain/valueObjects/email.ts";
import { createPlainPassword } from "../../domain/valueObjects/plainPassword.ts";
import type { AuthResponseDto, RegisterUserDto } from "../dtos.ts";
import type { IPasswordHasher } from "../ports/passwordHasher.port.ts";
import type { ITokenProvider } from "../ports/tokenProvider.port.ts";
import type { IUserRepository } from "../ports/userRepository.port.ts";

interface Deps {
  userRepository: IUserRepository;
  passwordHasher: IPasswordHasher;
  tokenProvider: ITokenProvider;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export async function registerUser(dto: RegisterUserDto, deps: Deps): Promise<AuthResponseDto> {
  const email = unwrap(createEmail(dto.email));
  const password = unwrap(createPlainPassword(dto.password));

  const existing = await deps.userRepository.findByEmail(email);
  if (existing) {
    throw AppError.conflict("User with this email already exists");
  }

  const hashedPassword = await deps.passwordHasher.hash(password);
  const now = deps.dateProvider.now();

  const user: User = {
    id: deps.idGenerator.generate(),
    email,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  };

  await deps.userRepository.create(user);
  const token = await deps.tokenProvider.sign({ userId: user.id });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
}
