import { AppError } from "@server/shared/kernel/appError.ts";
import type { PostResponseDto } from "../dtos.ts";
import { toPostResponse } from "../dtos.ts";
import type { IPostRepository } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
}

export async function getPost(id: string, deps: Deps): Promise<PostResponseDto> {
  const post = await deps.postRepository.findById(id);
  if (!post) {
    throw AppError.notFound("Post not found");
  }
  return toPostResponse(post);
}
