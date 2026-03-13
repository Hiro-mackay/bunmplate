import type { Post } from "../../domain/entities/post.ts";

export interface PostListQuery {
  cursor?: string;
  limit: number;
}

export interface PostListResult {
  posts: Post[];
  nextCursor: string | null;
}

export interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  list(query: PostListQuery): Promise<PostListResult>;
  create(post: Post): Promise<void>;
  update(id: string, data: Partial<Pick<Post, "title" | "content" | "updatedAt">>): Promise<void>;
  delete(id: string): Promise<void>;
}
