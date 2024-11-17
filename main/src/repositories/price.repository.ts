import { prices, Price } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";
import { eq, and, desc } from "drizzle-orm";

export interface IPriceRepository extends IRepository<Price> {
  getActivePrice(skuId: number): Promise<Price[]>;
  setPrice(
    skuId: number,
    newPrice: number,
    effectiveDate: Date
  ): Promise<Price>;
  scheduleFuturePrice(
    skuId: number,
    newPrice: number,
    effectiveDate: Date
  ): Promise<Price>;
}

@injectable()
export class PriceRepository
  extends Repository<Price>
  implements IPriceRepository
{
  constructor() {
    super(prices);
  }

  async getActivePrice(skuId: number) {
    return await this.db
      .select()
      .from(prices)
      .where(and(eq(prices.skuId, skuId), eq(prices.activate, true)))
      .orderBy(desc(prices.effectiveDate))
      .limit(1);
  }

  async setPrice(skuId: number, newPrice: number, effectiveDate: Date) {
    // Mark previous prices as inactive
    await this.db
      .update(prices)
      .set({ activate: false })
      .where(eq(prices.skuId, skuId));

    // Insert the new price record
    const [price] = await this.db
      .insert(prices)
      .values({
        skuId,
        price: newPrice.toFixed(2),
        effectiveDate,
        activate: true,
      })
      .returning();
    return price;
  }

  async scheduleFuturePrice(
    skuId: number,
    newPrice: number,
    effectiveDate: Date
  ) {
    const [price] = await this.db
      .insert(prices)
      .values({
        skuId,
        price: newPrice.toFixed(2),
        effectiveDate,
        activate: false,
      })
      .returning();
    return price;
  }
}
