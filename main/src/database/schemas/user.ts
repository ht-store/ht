import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { addresses } from "./address";
import { roles } from "./role";
import { carts } from "./cart";
import { feedbacks } from "./feedback";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    password: text("password").notNull(),
    phoneNumber: text("phone_number").notNull().unique(),
    rt: varchar("rt", { length: 256 }).unique(),
    stripeId: varchar("stripe_id"),
    roleId: integer("role_id")
      .references(() => roles.id)
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("users_id_idx").using("btree", table.id),
      emailIdx: uniqueIndex("users_email_idx").on(table.email),
      phoneNumberIdx: uniqueIndex("users_phone_number_idx").on(
        table.phoneNumber
      ),
      nameIdx: index("users_name_idx").on(table.name),
    };
  }
);

const userRelations = relations(users, ({ one, many }) => ({
  addresses: many(addresses),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  feedbacks: many(feedbacks),
}));

export type User = InferSelectModel<typeof users>;
