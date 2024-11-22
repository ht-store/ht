import {
  pgTable,
  serial,
  integer,
  decimal,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { importOrders } from "./import-order";
import { skus } from "./sku";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const importOrderItems = pgTable(
  "import_order_items",
  {
    id: serial("id").primaryKey(),
    importOrderId: integer("import_order_id").references(
      () => importOrders.id,
      { onDelete: "cascade" }
    ),
    skuId: integer("product_id").references(() => skus.id, {
      onDelete: "cascade",
    }),
    quantity: integer("quantity").notNull().default(1),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    importOrderIdIdx: index("idx_import_order_items_import_order_id").on(
      table.importOrderId
    ),
    productIdIdx: index("idx_import_order_items_product_id").on(table.skuId),
  })
);

const importProductRelations = relations(importOrderItems, ({ one }) => ({
  sku: one(skus, {
    fields: [importOrderItems.skuId],
    references: [skus.id],
  }),
  importOrder: one(importOrders, {
    fields: [importOrderItems.importOrderId],
    references: [importOrders.id],
  }),
}));

export type ImportOrderItem = InferSelectModel<typeof importOrderItems>;
export type CreateImportOrderItem = InferInsertModel<typeof importOrderItems>;
