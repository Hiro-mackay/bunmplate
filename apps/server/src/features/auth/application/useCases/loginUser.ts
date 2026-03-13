import { AppError } from "@server/shared/kernel/appError.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";
import { createEmail } from "../../domain/valueObjects/email.ts";
import type { AuthResponseDto, LoginUserDto } from "../dtos.ts";
import type { ITokenProvider } from "../ports/tokenProvider.port.ts";
import type { IUserRepository } from "../ports/userRepository.port.ts";

interface Deps {
  userRepository: IUserRepository;
  tokenProvider: ITokenProvider;
}

export async function loginUser(
  dto: LoginUserDto,
  deps: Deps,
): Promise<Result<AuthResponseDto, AppError>> {
  const emailResult = createEmail(dto.email);
  if (!emailResult.ok) return emailResult;

  const user = await deps.userRepository.findByEmail(emailResult.value);
  if (!user) return err(AppError.unauthorized("Invalid email or password"));

  const valid = await user.password.verify(dto.password);
  if (!valid) return err(AppError.unauthorized("Invalid email or password"));

  const token = await deps.tokenProvider.sign({ userId: user.id });

  return ok({
    token,
    user: { id: user.id, email: user.email },
  });
}
