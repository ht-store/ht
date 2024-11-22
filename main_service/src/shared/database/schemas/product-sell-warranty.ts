import { serial, integer, varchar, date, pgTable } from "drizzle-orm/pg-core";
import { warranties } from "./warranty";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { productSerials } from "./product-serial";
import { warrantyClaims } from "./warranty-claim";

export const productSellWarranties = pgTable("product_sell_warranties", {
  id: serial("id").primaryKey(),
  serial_id: integer("serial_id").references(() => productSerials.id, {
    onDelete: "cascade",
  }),
  warranty_id: integer("warranty_id").references(() => warranties.id, {
    onDelete: "set null",
  }),
  warranty_start_date: date("warranty_start_date").notNull(),
  warranty_end_date: date("warranty_end_date").notNull(),
  warranty_status: varchar("warranty_status", { length: 20 }).default("active"),
});

const productSellWarrantyRelations = relations(
  productSellWarranties,
  ({ one, many }) => ({
    productSerial: one(productSerials, {
      fields: [productSellWarranties.serial_id],
      references: [productSerials.id],
    }),
    warranty: one(warranties, {
      fields: [productSellWarranties.warranty_id],
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
