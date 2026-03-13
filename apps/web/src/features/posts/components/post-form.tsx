import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { parseError } from "../../../lib/api/parseError.ts";
import { useCreatePost } from "../api/mutations.ts";
import { createPostSchema } from "../validation.ts";

type CreatePostValues = z.infer<typeof createPostSchema>;

export function PostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", content: "" },
  });

  const createPost = useCreatePost();

  function onSubmit(data: CreatePostValues) {
    createPost.mutate(data);
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="font-semibold leading-none tracking-tight">New Post</div>
      </div>
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium leading-none">
              Title
            </label>
            <input
              id="title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <p id="title-error" role="alert" className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium leading-none">
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? "content-error" : undefined}
              {...register("content")}
            />
            {errors.content && (
              <p id="content-error" role="alert" className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>
          {createPost.error && (
            <p role="alert" className="text-sm text-destructive">
              {parseError(createPost.error)}
            </p>
          )}
          <button type="submit" disabled={createPost.isPending}>
            {createPost.isPending ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
