import type { Database } from "@bunmplate/drizzle";
import { posts } from "@bunmplate/drizzle/schemas";
import { desc, eq, lt } from "drizzle-orm";
import type {
  IPostRepository,
  PostListQuery,
  PostListResult,
} from "../application/ports/postRepository.port.ts";
import type { Post } from "../domain/entities/post.ts";

export class DrizzlePostRepository implements IPostRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Post | null> {
    const result = await this.db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0] ?? null;
  }

  async list(query: PostListQuery): Promise<PostListResult> {
    const conditions = query.cursor ? [lt(posts.id, query.cursor)] : [];

    const result = await this.db
      .select()
      .from(posts)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(posts.id))
      .limit(query.limit + 1);

    const hasMore = result.length > query.limit;
    const items = hasMore ? result.slice(0, query.limit) : result;
    const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;

    return { posts: items, nextCursor };
  }

  async create(post: Post): Promise<void> {
    await this.db.insert(posts).values({
      id: post.id,
      authorId: post.authorId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  }

  async update(
    id: string,
    data: Partial<Pick<Post, "title" | "content" | "updatedAt">>,
  ): Promise<void> {
    await this.db.update(posts).set(data).where(eq(posts.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(posts).where(eq(posts.id, id));
  }
}
