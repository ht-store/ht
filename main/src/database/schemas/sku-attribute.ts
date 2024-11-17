import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { skus } from "./sku";
import { attributes } from "./attribute";

export const skuAttributes = pgTable("sku_atrributes", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .references(() => skus.id, { onDelete: "cascade" })
    .notNull(),
  attributeId: integer("attribute_id")
    .references(() => attributes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  value: varchar("value", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const skuAttributeRelations = relations(skuAttributes, ({ one }) => ({
  sku: one(skus, {
    fields: [skuAttributes.skuId],
    references: [skus.id],
  }),
  attribute: one(attributes, {
    fields: [skuAttributes.attributeId],
    references: [attributes.id],
  }),
}));

export type SkuAttribute = InferSelectModel<typeof skuAttributes>;
export type CreateSkuAtrribute = InferInsertModel<typeof skuAttributes>;
