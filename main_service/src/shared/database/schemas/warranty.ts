import { serial, integer, text, pgTable } from "drizzle-orm/pg-core";
import { skus } from "./sku";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const warranties = pgTable("warranties", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").references(() => skus.id),
  warrantyPeriod: integer("warranty_period").notNull(),
  warrantyConditions: text("warranty_conditions"),
});

const warrantyRelations = relations(warranties, ({ one }) => ({
  sku: one(skus, {
    fields: [warranties.skuId],
    references: [skus.id],
  }),
}));

export type Warranty = InferSelectModel<typeof warranties>;
export type CreateWarranty = InferInsertModel<typeof warranties>;
