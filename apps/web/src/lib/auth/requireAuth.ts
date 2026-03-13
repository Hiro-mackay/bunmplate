import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth.ts";

export function requireAuth() {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw redirect({ to: "/login" });
  }
}
