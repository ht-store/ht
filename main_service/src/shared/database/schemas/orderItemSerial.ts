import { pgTable, serial, integer, index } from "drizzle-orm/pg-core";
import { orderItems } from "./orderItem";
import { productSerials } from "./product-serial";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const orderItemSerials = pgTable(
  "order_item_serials",
  {
    id: serial("id").primaryKey(),
    orderItemId: integer("order_item_id")
      .references(() => orderItems.id)
      .notNull(),
    productSerialId: integer("product_serial_id")
      .references(() => productSerials.id)
      .notNull(),
  },
  (table) => {
    return {
      orderItemSerialIdx: index("order_item_serial_order_item_id_idx").on(
        table.orderItemId
      ),
      productSerialIdx: index("order_item_serial_product_serial_id_idx").on(
        table.productSerialId
      ),
    };
  }
);

const orderItemSerialRelations = relations(orderItemSerials, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [orderItemSerials.orderItemId],
    references: [orderItems.id],
  }),
  productSerial: one(productSerials, {
    fields: [orderItemSerials.productSerialId],
    references: [productSerials.id],
  }),
}));

export type OrderItemSerial = InferSelectModel<typeof orderItemSerials>;
export type CreateOrderItemSerial = InferInsertModel<typeof orderItemSerials>;
