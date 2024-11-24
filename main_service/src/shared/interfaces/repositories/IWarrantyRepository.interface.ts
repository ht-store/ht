import { Warranty } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IWarrantyRepository extends IRepository<Warranty> {
  findBySkuId(skuId: number): Promise<Warranty | null>;
}
