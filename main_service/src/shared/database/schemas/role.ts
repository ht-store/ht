import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { users } from "./user";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export type Role = InferSelectModel<typeof roles>;
export type CreateRole = InferInsertModel<typeof roles>;
