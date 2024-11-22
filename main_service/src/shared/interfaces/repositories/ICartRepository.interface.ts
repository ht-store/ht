import { Cart } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

export interface ICartRepository extends IRepository<Cart> {
  findByUserIdRelation(customerId: number): Promise<any>;
  findByUserId(customerId: number): Promise<any>;
}
