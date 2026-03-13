import { createDatabase, type Database } from "@bunmplate/drizzle";

interface DatabaseConfig {
  url: string;
  poolSize?: number;
  idleTimeout?: number;
}

let client: ReturnType<typeof createDatabase> | null = null;

export function getDatabase(config: DatabaseConfig): Database {
  if (!client) {
    client = createDatabase(config.url, {
      max: config.poolSize,
      idleTimeout: config.idleTimeout,
    });
  }
  return client.db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
