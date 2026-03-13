import { createLazyFileRoute } from "@tanstack/react-router";
import { PostsPage } from "../../features/posts/pages/posts-page.tsx";

export const Route = createLazyFileRoute("/posts/")({
  component: PostsPage,
});
