import { Price } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

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
