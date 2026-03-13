import type { Database } from "@bunmplate/drizzle";
import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import { DrizzlePostRepository } from "./infrastructure/drizzlePostRepository.ts";

export interface PostsDeps {
  postRepository: InstanceType<typeof DrizzlePostRepository>;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export function createPostsDeps(
  tx: Database,
  config: { idGenerator: IIdGenerator; dateProvider: IDateProvider },
): PostsDeps {
  return {
    postRepository: new DrizzlePostRepository(tx),
    idGenerator: config.idGenerator,
    dateProvider: config.dateProvider,
  };
}
