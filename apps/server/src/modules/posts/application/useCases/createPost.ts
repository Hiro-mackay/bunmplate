import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import type { AppError } from "@server/shared/kernel/appError.ts";
import { ok, type Result } from "@server/shared/kernel/result.ts";
import { Post } from "../../domain/entities/post.ts";
import type { PostResponseDto } from "../dtos.ts";
import { toPostResponse } from "../dtos.ts";
import type { IPostRepository } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export async function createPost(
  dto: { title: string; content: string },
  authorId: string,
  deps: Deps,
): Promise<Result<PostResponseDto, AppError>> {
  const result = Post({
    id: deps.idGenerator.generate(),
    authorId,
    title: dto.title,
    content: dto.content,
    now: deps.dateProvider.now(),
  });
  if (!result.ok) return result;

  await deps.postRepository.create(result.value);
  return ok(toPostResponse(result.value));
}
