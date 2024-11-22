import { sql } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { inventories, Inventory } from "src/shared/database/schemas ";
import { IInventoryRepository } from "src/shared/interfaces/repositories";

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

  async reserveInventory(
    skuId: number,
    warehouseId: number,
    quantity: number
  ): Promise<Inventory> {
    const [res] = await this.db
      .update(inventories)
      .set({
        reservedQuantity: sql`${inventories.reservedQuantity} + ${quantity}`,
      })
      .where(sql`${inventories.skuId} = ${skuId}`)
      .returning();
    return res;
  }
}
