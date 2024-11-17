import { Order, orders } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface IOrderRepository extends IRepository<Order> {}

@injectable()
export class OrderRepository
  extends Repository<Order>
  implements IOrderRepository
{
  constructor() {
    super(orders);
  }
}
