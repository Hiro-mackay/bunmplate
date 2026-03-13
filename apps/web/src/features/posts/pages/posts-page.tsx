import { Link } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.ts";
import { PostList } from "../components/post-list.tsx";

export function PostsPage() {
  const isAuthenticated = useAuthStore((s) => s.token !== null);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        {isAuthenticated && (
          <Link to="/posts/new">
            <button type="button">New Post</button>
          </Link>
        )}
      </div>
      <PostList />
    </div>
  );
}
