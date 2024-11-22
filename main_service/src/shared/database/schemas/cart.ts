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
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { users } from "./user";
import { cartItems } from "./cartItem";

export const cartStatusEnum = pgEnum("cart_status", [
  "active",
  "inactive",
  "expired",
  "saved",
]);

export const carts = pgTable(
  "carts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    cartStatus: cartStatusEnum("cart_status").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("carts_id_idx").on(table.id),
      customerIdIdx: uniqueIndex("carts_customer_id_idx").on(table.id),
    };
  }
);

const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  cartItems: many(cartItems),
}));

export type Cart = InferSelectModel<typeof carts>;
export type CreateCart = InferInsertModel<typeof carts>;
