import type { Database } from "@bunmplate/drizzle";
import { posts } from "@bunmplate/drizzle/schemas";
import { desc, eq, lt } from "drizzle-orm";
import type {
  IPostRepository,
  PostListQuery,
  PostListResult,
} from "../application/ports/postRepository.port.ts";
import type { Post } from "../domain/entities/post.ts";
import { createContent } from "../domain/valueObjects/content.ts";
import { createTitle } from "../domain/valueObjects/title.ts";

export class DrizzlePostRepository implements IPostRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Post | null> {
    const result = await this.db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0] ? this.toEntity(result[0]) : null;
  }

  async list(query: PostListQuery): Promise<PostListResult> {
    const result = await this.db
      .select()
      .from(posts)
      .where(query.cursor ? lt(posts.createdAt, new Date(query.cursor)) : undefined)
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(query.limit + 1);

    const hasMore = result.length > query.limit;
    const items = hasMore ? result.slice(0, query.limit) : result;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore && lastItem ? lastItem.createdAt.toISOString() : null;

    return { posts: items.map((row) => this.toEntity(row)), nextCursor };
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

  async update(post: Post): Promise<void> {
    await this.db
      .update(posts)
      .set({
        title: post.title,
        content: post.content,
        updatedAt: post.updatedAt,
      })
      .where(eq(posts.id, post.id));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(posts).where(eq(posts.id, id));
  }

  private toEntity(row: {
    id: string;
    authorId: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }): Post {
    const titleResult = createTitle(row.title);
    if (!titleResult.ok) {
      throw new Error(`Corrupt post row ${row.id}: invalid title`);
    }
    const contentResult = createContent(row.content);
    if (!contentResult.ok) {
      throw new Error(`Corrupt post row ${row.id}: invalid content`);
    }
    return {
      id: row.id,
      authorId: row.authorId,
      title: titleResult.value,
      content: contentResult.value,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
