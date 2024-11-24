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
  productWarrantyId: integer("product_warranty_id").references(
    () => productSellWarranties.id,
    { onDelete: "cascade" }
  ),
  claimDate: timestamp("claim_date", { withTimezone: true }).defaultNow(),
  issueDescription: text("issue_description").notNull(),
  claimStatus: varchar("claim_status", { length: 20 }).default("pending"),
  resolution: text("resolution"),
});

const warrantyClaimRelaions = relations(warrantyClaims, ({ one }) => ({
  productWarranty: one(productSellWarranties, {
    fields: [warrantyClaims.productWarrantyId],
    references: [productSellWarranties.id],
  }),
}));

export type WarrantyClaim = InferSelectModel<typeof warrantyClaims>;
export type CreateWarrantyClaim = InferInsertModel<typeof warrantyClaims>;
