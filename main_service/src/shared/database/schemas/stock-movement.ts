import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { skus } from "./sku";
import { warehouses } from "./warehouse";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: serial("id").primaryKey(),
    skuId: integer("sku_id").references(() => skus.id, { onDelete: "cascade" }),
    warehouseId: integer("warehouse_id").references(() => warehouses.id, {
      onDelete: "cascade",
    }),
    movementType: varchar("movement_type", { length: 50 }).notNull(),
    quantity: integer("quantity").notNull(),
    movementDate: timestamp("movement_date").notNull().defaultNow(),
    referenceId: integer("reference_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    skuIdIdx: index("idx_stock_movements_sku_id").on(table.skuId),
    warehouseIdIdx: index("idx_stock_movements_warehouse_id").on(
      table.warehouseId
    ),
    movementDateIdx: index("idx_stock_movements_movement_date").on(
      table.movementDate
    ),
  })
);

const stockMovementRelations = relations(stockMovements, ({ one }) => ({
  sku: one(skus, {
    fields: [stockMovements.skuId],
    references: [skus.id],
  }),
  warehouse: one(warehouses, {
    fields: [stockMovements.warehouseId],
    references: [warehouses.id],
  }),
}));

export type StockMovement = InferSelectModel<typeof stockMovements>;
export type CreateStockMovement = InferInsertModel<typeof stockMovements>;
