import { useState } from "react";
import { useCreatePost } from "../api/mutations.ts";

export function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createPost = useCreatePost();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createPost.mutate({ title, content });
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="font-semibold leading-none tracking-tight">New Post</div>
      </div>
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium leading-none">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium leading-none">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
            />
          </div>
          {createPost.error && (
            <p className="text-sm text-destructive">{String(createPost.error)}</p>
          )}
          <button type="submit" disabled={createPost.isPending}>
            {createPost.isPending ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
