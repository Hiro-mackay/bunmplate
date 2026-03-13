import { Elysia } from "elysia";
import { AppError } from "../kernel/appError.ts";

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export function createRateLimitPlugin(config: RateLimitConfig) {
  const hits = new Map<string, number[]>();

  function cleanup(now: number) {
    for (const [key, timestamps] of hits) {
      const valid = timestamps.filter((t) => t > now - config.windowMs);
      if (valid.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, valid);
      }
    }
  }

  let lastCleanup = Date.now();

  return new Elysia({ name: "rate-limit" }).onBeforeHandle(({ request, set, server }) => {
    const now = Date.now();

    if (now - lastCleanup > config.windowMs) {
      cleanup(now);
      lastCleanup = now;
    }

    const address = server?.requestIP(request)?.address;
    if (!address) return;

    const path = new URL(request.url).pathname;
    const key = `${address}:${path}`;

    const timestamps = hits.get(key) ?? [];
    const windowStart = now - config.windowMs;
    const recent = timestamps.filter((t) => t > windowStart);

    if (recent.length >= config.max) {
      const oldest = recent[0] ?? now;
      const retryAfter = Math.ceil((oldest + config.windowMs - now) / 1000);
      set.headers["Retry-After"] = String(retryAfter);
      throw AppError.tooManyRequests("Too many requests, please try again later");
    }

    recent.push(now);
    hits.set(key, recent);
  });
}
