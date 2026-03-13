import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import { AppError } from "@server/shared/kernel/appError.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";
import { User } from "../../domain/entities/user.ts";
import type { AuthResponseDto, RegisterUserDto } from "../dtos.ts";
import type { ITokenProvider } from "../ports/tokenProvider.port.ts";
import type { IUserRepository } from "../ports/userRepository.port.ts";

interface Deps {
  userRepository: IUserRepository;
  tokenProvider: ITokenProvider;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export async function registerUser(
  dto: RegisterUserDto,
  deps: Deps,
): Promise<Result<AuthResponseDto, AppError>> {
  const existing = await deps.userRepository.findByEmail(dto.email);
  if (existing) return err(AppError.conflict("User with this email already exists"));

  const userResult = await User({
    id: deps.idGenerator.generate(),
    email: dto.email,
    password: dto.password,
    now: deps.dateProvider.now(),
  });
  if (!userResult.ok) return userResult;

  await deps.userRepository.create(userResult.value);
  const token = await deps.tokenProvider.sign({ userId: userResult.value.id });

  return ok({
    token,
    user: { id: userResult.value.id, email: userResult.value.email },
  });
}
