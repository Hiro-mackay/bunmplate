import type { Database } from "@bunmplate/drizzle";
import { users } from "@bunmplate/drizzle/schemas";
import { eq } from "drizzle-orm";
import type { IUserRepository } from "../application/ports/userRepository.port.ts";
import type { User } from "../domain/entities/user.ts";
import { createEmail } from "../domain/valueObjects/email.ts";
import { HashedPassword } from "../domain/valueObjects/hashedPassword.ts";

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] ? this.toEntity(result[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] ? this.toEntity(result[0]) : null;
  }

  async create(user: User): Promise<void> {
    await this.db.insert(users).values({
      id: user.id,
      email: user.email,
      password: user.password.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  private toEntity(row: {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    const emailResult = createEmail(row.email);
    if (!emailResult.ok) {
      throw new Error(`Corrupt user row ${row.id}: invalid email "${row.email}"`);
    }
    return {
      id: row.id,
      email: emailResult.value,
      password: HashedPassword.fromHashed(row.password),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
