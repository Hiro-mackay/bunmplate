import type { Database } from "@bunmplate/drizzle";
import { sql } from "drizzle-orm";
import { Elysia } from "elysia";

export function healthController(db: Database) {
  return new Elysia().get("/health", async () => {
    let dbStatus: "ok" | "error" = "ok";
    try {
      await db.execute(sql`SELECT 1`);
    } catch {
      dbStatus = "error";
    }
    const status = dbStatus === "ok" ? "ok" : "degraded";
    return {
      status,
      timestamp: new Date().toISOString(),
      components: { database: dbStatus },
    };
  });
}
