import { createLazyFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../features/auth/pages/login-page.tsx";

export const Route = createLazyFileRoute("/login")({
  component: LoginPage,
});
