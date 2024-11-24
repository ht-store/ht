import { OrderItem } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IOrderItemRepository extends IRepository<OrderItem> {
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
}
