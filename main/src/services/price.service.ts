import { inject, injectable } from "inversify";
import { Price } from "src/database/schemas";
import { IPriceRepository } from "src/repositories";
import { INTERFACE_NAME } from "src/shared/constants";

export interface IPriceService {
  getCurrentPrice(skuId: number): Promise<string>;
  addOrUpdatePrice(
    skuId: number,
    price: number,
    effectiveDate: Date
  ): Promise<Price>;
}

@injectable()
export class PriceService implements IPriceService {
  constructor(
    @inject(INTERFACE_NAME.PriceRepository)
    private priceRepository: IPriceRepository
  ) {}

  async getCurrentPrice(skuId: number): Promise<string> {
    const [priceRecord] = await this.priceRepository.getActivePrice(skuId);
    if (!priceRecord) throw new Error("No active price found for SKU");
    return priceRecord.price;
  }

  // Add or update a price, setting it as the current active price
  async addOrUpdatePrice(
    skuId: number,
    price: number,
    effectiveDate: Date
  ): Promise<Price> {
    const now = new Date();

    // If effective date is in the past or today, make it the active price
    const isImmediate = effectiveDate <= now;

    // Set the price, deactivating others if it's immediate
    return isImmediate
      ? await this.priceRepository.setPrice(skuId, price, effectiveDate)
      : await this.priceRepository.scheduleFuturePrice(
          skuId,
          price,
          effectiveDate
        );
  }
}
