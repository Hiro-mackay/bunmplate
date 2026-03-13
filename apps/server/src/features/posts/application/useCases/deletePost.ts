import { AppError } from "@server/shared/kernel/appError.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";
import { assertAuthor } from "../../domain/entities/post.ts";
import type { IPostRepository } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
}

export async function deletePost(
  id: string,
  userId: string,
  deps: Deps,
): Promise<Result<void, AppError>> {
  const found = await deps.postRepository.findById(id);
  if (!found) return err(AppError.notFound("Post not found"));

  const result = assertAuthor(found, userId);
  if (!result.ok) return result;

  await deps.postRepository.delete(result.value.id);
  return ok(undefined);
}
