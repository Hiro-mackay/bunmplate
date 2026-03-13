import type { Database } from "@bunmplate/drizzle";
import { users } from "@bunmplate/drizzle/schemas";
import { eq } from "drizzle-orm";
import type { IUserRepository } from "../application/ports/userRepository.port.ts";
import type { User } from "../domain/entities/user.ts";

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] ?? null;
  }

  async create(user: User): Promise<void> {
    await this.db.insert(users).values({
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
