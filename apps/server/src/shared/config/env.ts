import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  SERVER_PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default("http://localhost:3001"),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),
  DATABASE_IDLE_TIMEOUT: z.coerce.number().default(20),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    throw new Error(`Invalid environment variables: ${JSON.stringify(formatted)}`);
  }
  return result.data;
}
