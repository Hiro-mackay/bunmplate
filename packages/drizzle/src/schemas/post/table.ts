import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../user/table.ts";

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("posts_author_id_idx").on(table.authorId),
    index("posts_created_at_idx").on(table.createdAt),
  ],
);
