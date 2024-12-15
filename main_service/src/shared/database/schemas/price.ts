import {
  pgTable,
  serial,
  decimal,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { skus } from "./sku";

export const prices = pgTable("prices", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").references(() => skus.id, { onDelete: 'cascade' }),
  price: decimal("original_price", { precision: 9, scale: 0 }).notNull(),
  effectiveDate: timestamp("effective_date").notNull(),
  activate: boolean("activate").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const priceRelations = relations(prices, ({ one }) => ({
  sku: one(skus, {
    fields: [prices.skuId],
    references: [skus.id],
  }),
}));

export type Price = InferSelectModel<typeof prices>;
export type CreatePrice = InferInsertModel<typeof prices>;
