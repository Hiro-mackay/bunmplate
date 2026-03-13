export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

export interface PostResponseDto {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function toPostResponse(post: {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}): PostResponseDto {
  return {
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}
