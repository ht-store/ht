import {
  serial,
  integer,
  numeric,
  varchar,
  pgTable,
} from "drizzle-orm/pg-core";
import { warrantyClaims } from "./warranty-claim";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const warrantyClaimCosts = pgTable("warranty_claim_costs", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").references(() => warrantyClaims.id, {
    onDelete: "cascade",
  }),
  repairCost: numeric("repair_cost", { precision: 10, scale: 2 }).default(
    "0.00"
  ),
  partsCost: numeric("parts_cost", { precision: 10, scale: 2 }).default("0.00"),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default(
    "0.00"
  ),
  currency: varchar("currency", { length: 3 }).default("VND"),
});

const warrantyClaimCostRelations = relations(warrantyClaimCosts, ({ one }) => ({
  warrantyClaim: one(warrantyClaims, {
    fields: [warrantyClaimCosts.claimId],
    references: [warrantyClaims.id],
  }),
}));

export type WarrantyClaimCost = InferSelectModel<typeof warrantyClaimCosts>;
export type CreateWarrantyClaimCost = InferInsertModel<
  typeof warrantyClaimCosts
>;
