import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  index,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { skus } from "./sku";
import { users } from "./user";
import { orderItems } from "./orderItem";

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderItemId: integer("order_item_id").references(() => orderItems.id),
  content: text("content").notNull(),
  star: integer("star").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const feedbackRelaions = relations(feedbacks, ({ one, many }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
  orderItem: one(orderItems, {
    fields: [feedbacks.orderItemId],
    references: [orderItems.id],
  }),
}));

export type Feedback = InferSelectModel<typeof feedbacks>;
