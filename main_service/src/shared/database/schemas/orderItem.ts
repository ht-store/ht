import {
  pgTable,
  serial,
  timestamp,
  integer,
  pgEnum,
  decimal,
  index,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { orders } from "./order";
import { productSerials } from "./product-serial";
import { skus } from "./sku";
import { orderItemSerials } from "./orderItemSerial";
import { feedbacks } from "./feedback";

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .references(() => orders.id)
      .notNull(),
    skuId: integer("sku_id")
      .references(() => skus.id)
      .notNull(),
    serialId: integer("serial_id")
      .references(() => productSerials.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 0 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("order_items_products_id_idx").on(table.id),
      orderIdIdx: index("order_items_products_order_id_idx").on(table.orderId),
    };
  }
);

const orderItemRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  skus: one(skus, {
    fields: [orderItems.skuId],
    references: [skus.id],
  }),
  orderItemSerials: many(orderItemSerials),
  feedbacks: many(feedbacks),
  productSerials: one(productSerials, {
    fields: [orderItems.skuId],
    references: [productSerials.id],
  }),
}));

export type OrderItem = InferSelectModel<typeof orderItems>;
export type CreateOrderItem = InferInsertModel<typeof orderItems>;
