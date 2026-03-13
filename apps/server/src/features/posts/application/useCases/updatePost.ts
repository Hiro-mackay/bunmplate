import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import { AppError } from "@server/shared/kernel/appError.ts";
import { unwrap } from "@server/shared/kernel/result.ts";
import { createTitle } from "../../domain/valueObjects/title.ts";
import type { PostResponseDto, UpdatePostDto } from "../dtos.ts";
import { toPostResponse } from "../dtos.ts";
import type { IPostRepository } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
  dateProvider: IDateProvider;
}

export async function updatePost(
  id: string,
  dto: UpdatePostDto,
  userId: string,
  deps: Deps,
): Promise<PostResponseDto> {
  const post = await deps.postRepository.findById(id);
  if (!post) {
    throw AppError.notFound("Post not found");
  }
  if (post.authorId !== userId) {
    throw AppError.forbidden("You can only update your own posts");
  }

  const updates: Partial<{ title: string; content: string; updatedAt: Date }> = {
    updatedAt: deps.dateProvider.now(),
  };

  if (dto.title !== undefined) {
    updates.title = unwrap(createTitle(dto.title));
  }

  if (dto.content !== undefined) {
    updates.content = dto.content;
  }

  await deps.postRepository.update(id, updates);

  return toPostResponse({
    ...post,
    ...updates,
    updatedAt: updates.updatedAt ?? post.updatedAt,
  });
}
