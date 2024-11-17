import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { importOrders } from "./import-order";

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  email: varchar("email", { length: 255 }).unique(),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const supplierRelations = relations(suppliers, ({ many }) => ({
  importOrders: many(importOrders),
}));

export type Supplier = InferSelectModel<typeof suppliers>;
