import { createFileRoute } from "@tanstack/react-router";
import { PostForm } from "../features/posts/components/post-form.tsx";

export const Route = createFileRoute("/posts/new")({
  component: NewPostPage,
});

function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Create Post</h1>
      <PostForm />
    </div>
  );
}
