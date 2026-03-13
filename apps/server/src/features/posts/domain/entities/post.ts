import { AppError } from "@server/shared/kernel/appError.ts";
import { err, ok, type Result } from "@server/shared/kernel/result.ts";
import { type Content, createContent } from "../valueObjects/content.ts";
import { createTitle, type Title } from "../valueObjects/title.ts";

export interface Post {
  readonly id: string;
  readonly authorId: string;
  readonly title: Title;
  readonly content: Content;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function Post(params: {
  id: string;
  authorId: string;
  title: string;
  content: string;
  now: Date;
}): Result<Post, AppError> {
  const title = createTitle(params.title);
  if (!title.ok) return title;

  const content = createContent(params.content);
  if (!content.ok) return content;

  return ok({
    id: params.id,
    authorId: params.authorId,
    title: title.value,
    content: content.value,
    createdAt: params.now,
    updatedAt: params.now,
  });
}

export function changeTitle(post: Post, raw: string, now: Date): Result<Post, AppError> {
  const title = createTitle(raw);
  if (!title.ok) return title;
  return ok({ ...post, title: title.value, updatedAt: now });
}

export function changeContent(post: Post, raw: string, now: Date): Result<Post, AppError> {
  const content = createContent(raw);
  if (!content.ok) return content;
  return ok({ ...post, content: content.value, updatedAt: now });
}

export function assertAuthor(post: Post, userId: string): Result<Post, AppError> {
  if (post.authorId !== userId) {
    return err(AppError.forbidden("You can only modify your own posts"));
  }
  return ok(post);
}
