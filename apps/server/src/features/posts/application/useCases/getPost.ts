import { AppError } from "@server/shared/kernel/appError.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";
import type { PostResponseDto } from "../dtos.ts";
import { toPostResponse } from "../dtos.ts";
import type { IPostRepository } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
}

export async function getPost(id: string, deps: Deps): Promise<Result<PostResponseDto, AppError>> {
  const post = await deps.postRepository.findById(id);
  if (!post) return err(AppError.notFound("Post not found"));
  return ok(toPostResponse(post));
}
