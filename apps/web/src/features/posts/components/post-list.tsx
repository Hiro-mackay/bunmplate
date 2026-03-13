import { Link } from "@tanstack/react-router";
import { usePosts } from "../api/queries.ts";

export function PostList() {
  const { data, isLoading, error } = usePosts();

  if (isLoading) return <p className="text-muted-foreground">Loading posts...</p>;
  if (error) return <p className="text-destructive">Failed to load posts</p>;
  if (!data?.data.length) return <p className="text-muted-foreground">No posts yet.</p>;

  return (
    <ul aria-label="Posts" className="flex flex-col gap-4">
      {data.data.map((post) => (
        <li key={post.id}>
          <Link to="/posts/$postId" params={{ postId: post.id }}>
            <div className="rounded-xl border bg-card text-card-foreground shadow transition-colors hover:bg-accent">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="font-semibold leading-none tracking-tight">{post.title}</div>
              </div>
              <div className="p-6 pt-0">
                <p className="line-clamp-2 text-muted-foreground">{post.content}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
