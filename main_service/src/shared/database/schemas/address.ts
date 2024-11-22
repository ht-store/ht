import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import {
  InferColumnsDataTypes,
  InferInsertModel,
  InferSelectModel,
  Column,
  relations,
  or,
} from "drizzle-orm";
import { users } from "./user";
import { orders } from "./order";

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  streetAddress: text("street_address"),
  wardOrCommune: text("ward/commune"),
  district: text("district"),
  cityOrProvince: text("city/province"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

const addressRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  orders: many(orders),
}));

export type Address = InferSelectModel<typeof addresses>;
export type CreateAddress = InferInsertModel<typeof addresses>;
