import {
  pgTable,
  serial,
  timestamp,
  varchar,
  index,
  PgColumn,
  PgTableWithColumns,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { skuAttributes } from "./sku-attribute";

export const attributes = pgTable(
  "attributes",
  {
    id: serial("id").primaryKey(),
    type: varchar("type").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("attributes_id_idx").on(table.id),
    };
  }
);

const attributeRelation = relations(attributes, ({ many }) => ({
  skuAttributes: many(skuAttributes),
}));

export type Attribute = InferSelectModel<typeof attributes>;
export type CreateAttribute = InferInsertModel<typeof attributes>;
