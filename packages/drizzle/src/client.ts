import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas/index.ts";

interface DatabaseOptions {
  max?: number;
  idleTimeout?: number;
  connectTimeout?: number;
}

export function createDatabase(url: string, options?: DatabaseOptions) {
  const client = postgres(url, {
    max: options?.max ?? 10,
    idle_timeout: options?.idleTimeout ?? 20,
    connect_timeout: options?.connectTimeout ?? 10,
  });
  const db = drizzle({ client, schema });
  return { db, close: (timeout = 5) => client.end({ timeout }) };
}

export type DatabaseClient = ReturnType<typeof createDatabase>;
export type Database = DatabaseClient["db"];
