import { createFileRoute } from "@tanstack/react-router";
import { PostDetailPage } from "../../features/posts/pages/post-detail-page.tsx";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetailPage,
});
