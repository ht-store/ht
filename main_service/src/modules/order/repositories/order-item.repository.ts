import { DB } from "src/shared/database/connect";
import {
  CreateOrderItem,
  OrderItem,
  orderItems,
} from "src/shared/database/schemas";
import { eq } from "drizzle-orm";
import { IOrderItemRepository } from "src/shared/interfaces/repositories";
import { Repository } from "src/shared/base-repository";

export class OrderItemRepository
  extends Repository<OrderItem>
  implements IOrderItemRepository
{
  constructor() {
    super(orderItems);
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }
}
