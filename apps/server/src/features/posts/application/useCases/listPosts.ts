import type { PostResponseDto } from "../dtos.ts";
import { toPostResponse } from "../dtos.ts";
import type { IPostRepository, PostListQuery } from "../ports/postRepository.port.ts";

interface Deps {
  postRepository: IPostRepository;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

interface ListPostsResponse {
  data: PostResponseDto[];
  pagination: { nextCursor: string | null };
}

export async function listPosts(
  query: { cursor?: string; limit?: number },
  deps: Deps,
): Promise<ListPostsResponse> {
  const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
  const listQuery: PostListQuery = { cursor: query.cursor, limit };

  const result = await deps.postRepository.list(listQuery);

  return {
    data: result.posts.map(toPostResponse),
    pagination: { nextCursor: result.nextCursor },
  };
}
