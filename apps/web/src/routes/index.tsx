import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20">
      <h1 className="text-4xl font-bold">bunmplate</h1>
      <p className="text-lg text-muted-foreground">
        Bun + Elysia + React monorepo template with end-to-end type safety
      </p>
      <div className="flex gap-4">
        <Link to="/posts">
          <button type="button">Browse Posts</button>
        </Link>
        <Link to="/login">
          <button type="button">Get Started</button>
        </Link>
      </div>
    </div>
  );
}
