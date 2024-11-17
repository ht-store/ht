import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { carts } from "./cart";
import { skus } from "./sku";

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .references(() => carts.id, { onDelete: "cascade" })
    .notNull(),
  skuId: integer("sku_id")
    .references(() => skus.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const cartItemRelation = relations(cartItems, ({ one }) => ({
  sku: one(skus, {
    fields: [cartItems.skuId],
    references: [skus.id],
  }),
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}));

export type CartItem = InferSelectModel<typeof cartItems>;
