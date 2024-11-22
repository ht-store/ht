import {
  serial,
  integer,
  text,
  timestamp,
  varchar,
  pgTable,
} from "drizzle-orm/pg-core";
import { productSellWarranties } from "./product-sell-warranty";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const warrantyClaims = pgTable("warranty_claims", {
  id: serial("id").primaryKey(),
  product_warranty_id: integer("product_warranty_id").references(
    () => productSellWarranties.id,
    { onDelete: "cascade" }
  ),
  claim_date: timestamp("claim_date", { withTimezone: true }).defaultNow(),
  issue_description: text("issue_description").notNull(),
  claim_status: varchar("claim_status", { length: 20 }).default("pending"),
  resolution: text("resolution"),
});

const warrantyClaimRelaions = relations(warrantyClaims, ({ one }) => ({
  productWarranty: one(productSellWarranties, {
    fields: [warrantyClaims.product_warranty_id],
    references: [productSellWarranties.id],
  }),
}));

export type WarrantyClaim = InferSelectModel<typeof warrantyClaims>;
export type CreateWarrantyClaim = InferInsertModel<typeof warrantyClaims>;
