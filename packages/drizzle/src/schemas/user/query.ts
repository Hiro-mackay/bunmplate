import { relations } from "drizzle-orm";
import { posts } from "../post/table.ts";
import { users } from "./table.ts";

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
