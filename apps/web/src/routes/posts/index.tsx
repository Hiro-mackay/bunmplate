import { createFileRoute } from "@tanstack/react-router";
import { PostsPage } from "../../features/posts/pages/posts-page.tsx";

export const Route = createFileRoute("/posts/")({
  component: PostsPage,
});
