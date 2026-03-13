import type { Database } from "@bunmplate/drizzle";
import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import { BunPasswordHasher } from "./infrastructure/bunPasswordHasher.ts";
import { DrizzleUserRepository } from "./infrastructure/drizzleUserRepository.ts";
import { JwtTokenProvider } from "./infrastructure/jwtTokenProvider.ts";

export interface AuthConfig {
  jwtSecret: string;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export interface AuthDeps {
  userRepository: InstanceType<typeof DrizzleUserRepository>;
  passwordHasher: BunPasswordHasher;
  tokenProvider: JwtTokenProvider;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export function createAuthDeps(tx: Database, config: AuthConfig): AuthDeps {
  return {
    userRepository: new DrizzleUserRepository(tx),
    passwordHasher: new BunPasswordHasher(),
    tokenProvider: new JwtTokenProvider(config.jwtSecret),
    idGenerator: config.idGenerator,
    dateProvider: config.dateProvider,
  };
}
