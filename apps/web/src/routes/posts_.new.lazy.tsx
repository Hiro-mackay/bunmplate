import { createLazyFileRoute } from "@tanstack/react-router";
import { PostForm } from "../features/posts/components/post-form.tsx";

function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Create Post</h1>
      <PostForm />
    </div>
  );
}

export const Route = createLazyFileRoute("/posts_/new")({
  component: NewPostPage,
});
