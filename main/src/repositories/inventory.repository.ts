import { inventories, Inventory } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";
import { sql } from "drizzle-orm";

export interface IInventoryRepository extends IRepository<Inventory> {
  updateQuanity(
    skuId: number,
    warehouseId: number,
    quantity: number
  ): Promise<Inventory>;
}

@injectable()
export class InventoryRepository
  extends Repository<Inventory>
  implements IInventoryRepository
{
  constructor() {
    super(inventories);
  }

  async updateQuanity(skuId: number, warehouseId: number, quantity: number) {
    const [res] = await this.db
      .insert(inventories)
      .values({
        skuId,
        warehouseId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [inventories.skuId, inventories.warehouseId],
        set: {
          quantity: sql`${inventories.quantity} + ${quantity}`,
        },
      })
      .returning(); // Add returning() to get the result back
    return res;
  }
}
