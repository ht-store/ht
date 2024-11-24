import { CreateOrder, Order } from "src/shared/database/schemas";
import { OrderStatus } from "src/shared/types";
import { IRepository } from "./IRepository.interface";

export interface IOrderRepository extends IRepository<Order> {
  createOrder(data: CreateOrder): Promise<Order>;
  getOrderById(orderId: number): Promise<Order | null>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: number, status: OrderStatus): Promise<void>;
}
