import { relations } from "drizzle-orm";
import { users } from "../user/table.ts";
import { posts } from "./table.ts";

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
