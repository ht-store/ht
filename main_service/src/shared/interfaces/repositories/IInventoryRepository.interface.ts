import { Inventory } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

export interface IInventoryRepository extends IRepository<Inventory> {
  updateQuanity(
    skuId: number,
    warehouseId: number,
    quantity: number
  ): Promise<Inventory>;

  reserveInventory(
    skuId: number,
    warehouseId: number,
    quantity: number
  ): Promise<Inventory>;
}
