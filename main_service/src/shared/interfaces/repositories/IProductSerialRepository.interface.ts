import { ProductSerial } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IProductSerialRepository extends IRepository<ProductSerial> {
  findFirstBySkuIdandSerial(
    skuId: number,
    serial: string
  ): Promise<ProductSerial | null>;

  findFirstBySkuId(skuId: number): Promise<ProductSerial | null>;
}
