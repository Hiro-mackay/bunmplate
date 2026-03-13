import { createLazyFileRoute } from "@tanstack/react-router";
import { PostDetailPage } from "../../features/posts/pages/post-detail-page.tsx";

export const Route = createLazyFileRoute("/posts/$postId")({
  component: PostDetailPage,
});
