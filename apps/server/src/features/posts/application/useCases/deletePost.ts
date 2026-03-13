import { AppError } from "@server/shared/kernel/appError.ts";
import type { IPostRepository } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
}

export async function deletePost(id: string, userId: string, deps: Deps): Promise<void> {
  const post = await deps.postRepository.findById(id);
  if (!post) {
    throw AppError.notFound("Post not found");
  }
  if (post.authorId !== userId) {
    throw AppError.forbidden("You can only delete your own posts");
  }

  await deps.postRepository.delete(id);
}
