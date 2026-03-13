import { Elysia } from "elysia";

const isProduction = process.env.NODE_ENV === "production";

export const securityHeadersPlugin = new Elysia({ name: "security-headers" }).onAfterHandle(
  ({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    set.headers["Content-Security-Policy"] =
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'";
    if (isProduction) {
      set.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
    }
  },
);
