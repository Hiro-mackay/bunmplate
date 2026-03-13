import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import { AppError } from "@server/shared/kernel/appError.ts";
import { err, flatMap, ok, type Result } from "@server/shared/kernel/result.ts";
import { assertAuthor, changeContent, changeTitle } from "../../domain/entities/post.ts";
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
): Promise<Result<PostResponseDto, AppError>> {
  const found = await deps.postRepository.findById(id);
  if (!found) return err(AppError.notFound("Post not found"));

  let result = assertAuthor(found, userId);
  if (!result.ok) return result;

  const now = deps.dateProvider.now();
  if (dto.title !== undefined) {
    const title = dto.title;
    result = flatMap(result, (p) => changeTitle(p, title, now));
  }
  if (dto.content !== undefined) {
    const content = dto.content;
    result = flatMap(result, (p) => changeContent(p, content, now));
  }
  if (!result.ok) return result;

  await deps.postRepository.update(result.value);
  return ok(toPostResponse(result.value));
}
