import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth/requireAuth.ts";

export const Route = createFileRoute("/posts_/new")({
  beforeLoad: () => requireAuth(),
});
