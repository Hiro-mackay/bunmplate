import { useNavigate, useParams } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.ts";
import { useDeletePost } from "../api/mutations.ts";
import { usePost } from "../api/queries.ts";

export function PostDetailPage() {
  const { postId } = useParams({ from: "/posts/$postId" });
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(postId);
  const deletePost = useDeletePost();
  const user = useAuthStore((s) => s.user);

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error || !post) return <p className="text-destructive">Post not found</p>;

  const isOwner = user?.id === post.authorId;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="font-semibold leading-none tracking-tight">{post.title}</div>
          <p className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="p-6 pt-0">
          <p className="whitespace-pre-wrap">{post.content}</p>
          {isOwner && (
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => deletePost.mutate(postId)}
                disabled={deletePost.isPending}
              >
                {deletePost.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
      <button type="button" className="mt-4" onClick={() => navigate({ to: "/posts" })}>
        Back to Posts
      </button>
    </div>
  );
}
