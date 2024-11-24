import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { skus } from "./sku";
import { productSellWarranties } from "./product-sell-warranty";

export const productSerialStatusEnum = pgEnum("product_serial_status", [
  "inventory",
  "under warrantying",
  "sold",
  "block",
]);

export const productSerials = pgTable(
  "serial_numbers",
  {
    id: serial("id").primaryKey(),
    serialNumber: varchar("serial_number", { length: 100 }).notNull().unique(),
    skuId: integer("sku_id").references(() => skus.id),
    status: productSerialStatusEnum("status").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("serial_numbers_id_idx").on(table.id),
      serialNumberIdx: index("serial_numbers_serial_number_idx").on(
        table.serialNumber
      ),
    };
  }
);

const productSerialsRelations = relations(productSerials, ({ one, many }) => ({
  sku: one(skus, {
    fields: [productSerials.skuId],
    references: [skus.id],
  }),
  productSellWarranties: many(productSellWarranties),
}));

export type ProductSerial = InferSelectModel<typeof productSerials>;
export type ProductSerialData = InferInsertModel<typeof productSerials>;
