import { serial, integer, text, pgTable } from "drizzle-orm/pg-core";
import { skus } from "./sku";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const warranties = pgTable("warranties", {
  id: serial("id").primaryKey(),
  sku_id: integer("sku_id").references(() => skus.id),
  warranty_period: integer("warranty_period").notNull(),
  warranty_conditions: text("warranty_conditions"),
});

const warrantyRelations = relations(warranties, ({ one }) => ({
  sku: one(skus, {
    fields: [warranties.sku_id],
    references: [skus.id],
  }),
}));

export type Warranty = InferSelectModel<typeof warranties>;
export type CreateWarranty = InferInsertModel<typeof warranties>;
