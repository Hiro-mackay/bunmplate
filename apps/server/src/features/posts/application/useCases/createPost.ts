import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import { unwrap } from "@server/shared/kernel/result.ts";
import type { Post } from "../../domain/entities/post.ts";
import { createTitle } from "../../domain/valueObjects/title.ts";
import type { CreatePostDto, PostResponseDto } from "../dtos.ts";
import { toPostResponse } from "../dtos.ts";
import type { IPostRepository } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export async function createPost(
  dto: CreatePostDto,
  authorId: string,
  deps: Deps,
): Promise<PostResponseDto> {
  const title = unwrap(createTitle(dto.title));

  const now = deps.dateProvider.now();
  const post: Post = {
    id: deps.idGenerator.generate(),
    authorId,
    title,
    content: dto.content,
    createdAt: now,
    updatedAt: now,
  };

  await deps.postRepository.create(post);
  return toPostResponse(post);
}
