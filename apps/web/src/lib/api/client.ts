import type { App } from "@bunmplate/server/type";
import { treaty } from "@elysiajs/eden";
import { env } from "../../env.ts";
import { useAuthStore } from "../../stores/auth.ts";

export const api = treaty<App>(env.VITE_API_URL, {
  headers() {
    const token = useAuthStore.getState().token;
    if (token) {
      return { authorization: `Bearer ${token}` };
    }
    return {};
  },
});
