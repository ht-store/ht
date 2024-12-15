import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm";
import { products } from "./product";
import { prices } from "./price";
import { cartItems } from "./cartItem";
import { skuAttributes } from "./sku-attribute";
import { inventories } from "./inventory";
import { orderItems } from "./orderItem";
import { stockMovements } from "./stock-movement";
import { warranties } from "./warranty";

export const skus = pgTable("skus", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name").notNull().unique(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    nameSearchIdx: index("name_sku_search_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.name})`
    ),
  };
});

const skuRelations = relations(skus, ({ one, many }) => ({
  product: one(products, {
    fields: [skus.productId],
    references: [products.id],
  }),
  prices: many(prices),
  cartItems: many(cartItems),
  skuAttributes: many(skuAttributes),
  inventories: many(inventories),
  orderItems: many(orderItems),
  stockMovements: many(stockMovements),
  warranties: many(warranties),
}));

export type Sku = InferSelectModel<typeof skus>;
export type CreateSku = InferInsertModel<typeof skus>;
