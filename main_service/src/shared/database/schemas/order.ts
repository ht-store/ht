import {
  pgTable,
  serial,
  timestamp,
  integer,
  pgEnum,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { addresses } from "./address";
import { orderItems } from "./orderItem";
export const paymentType = pgEnum("payment_type", ["online", "Khi nhận hàng"]);
export const orderStatusEnum = pgEnum("order_status", [
  "Đang chờ xử lý",
  "Đang xử lý",
  "Được xác nhận",
  "Đang vận chuyển",
  "Đã giao hàng",
  "Đã hủy",
  "Trả lại",
]);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    totalPrice: decimal("total_price", { precision: 10, scale: 0 }).notNull(),
    orderDate: timestamp("order_date").notNull().defaultNow(),
    orderStatus: orderStatusEnum("order_status").notNull(),
    paymentType: paymentType("payment_type").notNull(),
    checkoutSessionId: varchar("checkout_session_id").notNull(),
    stripePaymentIntentId: varchar("payment_intent_id").notNull(),
    shippingAddressId: integer("shipping_address_id").references(
      () => addresses.id
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      idIdx: index("orders_id_idx").on(table.id),
      customerIdIdx: index("orders_customer_id_idx").on(table.id),
    };
  }
);

const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export type Order = InferSelectModel<typeof orders>;
export type CreateOrder = InferInsertModel<typeof orders>;
