import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { inventories } from "./inventory";
import { stockMovements } from "./stock-movement";

export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  location: varchar("location", { length: 255 }),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const warehouseRelations = relations(warehouses, ({ many }) => ({
  inventories: many(inventories),
  stockMovements: many(stockMovements),
}));

export type Warehouse = InferSelectModel<typeof warehouses>;
