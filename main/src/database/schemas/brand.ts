import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { products } from "./product";

export const brands = pgTable(
  "brands",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("brands_id_idx").on(table.id),
    };
  }
);

const brandRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export type Brand = InferSelectModel<typeof brands>;
