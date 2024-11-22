import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  index,
  boolean,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import { brands } from "./brand";
import { categories } from "./category";
import { skus } from "./sku";
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    // image: json('image').$type<{ public_id: string, url: string }>().default({ public_id: "", url: "" }).notNull(),
    image: text("image").notNull(),
    originalPrice: decimal("original_price", {
      precision: 9,
      scale: 0,
    }).notNull(),
    brandId: integer("brand_id")
      .references(() => brands.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    screenSize: varchar("screenSize").notNull(),
    battery: varchar("battery").notNull(),
    camera: varchar("camera").notNull(),
    processor: varchar("processor").notNull(),
    os: varchar("os").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      nameSearchIdx: index("name_search_idx").using(
        "gin",
        sql`to_tsvector('english', ${table.name})`
      ),
    };
  }
);

const productRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  skus: many(skus),
}));

export type Product = InferSelectModel<typeof products>;
export type CreateProduct = InferInsertModel<typeof products>;
