import { serial, integer, varchar, date, pgTable } from "drizzle-orm/pg-core";
import { warranties } from "./warranty";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { productSerials } from "./product-serial";
import { warrantyClaims } from "./warranty-claim";

export const productSellWarranties = pgTable("product_sell_warranties", {
  id: serial("id").primaryKey(),
  serialId: integer("serial_id").references(() => productSerials.id, {
    onDelete: "cascade",
  }),
  warrantyId: integer("warranty_id").references(() => warranties.id, {
    onDelete: "set null",
  }),
  warrantyStartDate: date("warranty_start_date").notNull(),
  warrantyEndDate: date("warranty_end_date").notNull(),
  warrantyStatus: varchar("warranty_status", { length: 20 }).default("active"),
});

const productSellWarrantyRelations = relations(
  productSellWarranties,
  ({ one, many }) => ({
    productSerial: one(productSerials, {
      fields: [productSellWarranties.serialId],
      references: [productSerials.id],
    }),
    warranty: one(warranties, {
      fields: [productSellWarranties.warrantyId],
      references: [warranties.id],
    }),
    warrantyClaims: many(warrantyClaims),
  })
);

export type ProductSellWarranty = InferSelectModel<
  typeof productSellWarranties
>;

export type CreateProductSellWarranty = InferInsertModel<
  typeof productSellWarranties
>;
