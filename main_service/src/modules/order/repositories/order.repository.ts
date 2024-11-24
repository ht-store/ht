import { Repository } from "src/shared/base-repository";
import { CreateOrder, Order, orders } from "src/shared/database/schemas";
import { IOrderRepository } from "src/shared/interfaces/repositories";
import { OrderStatus } from "src/shared/types";
import { eq } from "drizzle-orm";
export class OrderRepository
  extends Repository<Order>
  implements IOrderRepository
{
  constructor() {
    super(orders);
  }
  async createOrder(data: CreateOrder): Promise<Order> {
    return await this.db
      .insert(orders)
      .values(data)
      .returning()
      .then(([result]) => result);
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    return await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .then(([result]) => result || null);
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await this.db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.db.select().from(orders);
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    await this.db
      .update(orders)
      .set({ orderStatus: status })
      .where(eq(orders.id, orderId));
  }
}
