import { ProductSellWarranty } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IProductSellWarrantyRepository
  extends IRepository<ProductSellWarranty> {
  findBySerial(serialId: number): Promise<ProductSellWarranty | null>;
  findByStatus(status: string): Promise<ProductSellWarranty[]>;
}
