import {
  pgTable,
  serial,
  integer,
  date,
  varchar,
  decimal,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { suppliers } from "./supplier";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { importOrderItems } from "./import-order-item";

export const importOrders = pgTable(
  "import_orders",
  {
    id: serial("id").primaryKey(),
    supplierId: integer("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),
    orderDate: date("order_date").notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    supplierIdIdx: index("idx_import_orders_supplier_id").on(table.supplierId),
    orderDateIdx: index("idx_import_orders_order_date").on(table.orderDate),
  })
);

const importOrderRelations = relations(importOrders, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [importOrders.supplierId],
    references: [suppliers.id],
  }),
  imporOrderItems: many(importOrderItems),
}));

export type ImportOrder = InferSelectModel<typeof importOrders>;
export type CreateImportOrder = InferInsertModel<typeof importOrders>;
