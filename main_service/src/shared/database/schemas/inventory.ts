import {
  pgTable,
  serial,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { skus } from "./sku";
import { warehouses } from "./warehouse";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { stockMovements } from "./stock-movement";

export const inventories = pgTable(
  "inventories",
  {
    id: serial("id").primaryKey(),
    skuId: integer("sku_id").references(() => skus.id, {
      onDelete: "cascade",
    }),
    warehouseId: integer("warehouse_id").references(() => warehouses.id, {
      onDelete: "cascade",
    }),
    quantity: integer("quantity").notNull().default(0),
    reservedQuantity: integer("reserved_quantity").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    skuIdWarehouseUnique: unique().on(table.skuId, table.warehouseId),
    skuIdIdIdx: index("idx_inventory_product_id").on(table.skuId),
    warehouseIdIdx: index("idx_inventory_warehouse_id").on(table.warehouseId),
  })
);

const inventoryRelations = relations(inventories, ({ one, many }) => ({
  sku: one(skus, {
    fields: [inventories.skuId],
    references: [skus.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventories.warehouseId],
    references: [warehouses.id],
  }),
}));

export type Inventory = InferSelectModel<typeof inventories>;
export type CreateInventory = InferInsertModel<typeof inventories>;
