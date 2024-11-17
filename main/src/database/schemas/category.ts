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

export const categoriesEnum = pgEnum("name", ["mobile_phone", "tablet"]);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: categoriesEnum("name").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("categories_id_idx").on(table.id),
    };
  }
);

const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export type Category = InferSelectModel<typeof categories>;
