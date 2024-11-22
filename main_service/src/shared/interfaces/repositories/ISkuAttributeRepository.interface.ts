import { SkuAttribute } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

export interface ISkuAttributeRepository extends IRepository<SkuAttribute> {
  findBySkuId(skuId: number): Promise<SkuAttribute[]>;
  findByAttributeId(attributeId: number): Promise<SkuAttribute[]>;
  findBySkuIdAndAttributeId(
    skuId: number,
    attributeId: number
  ): Promise<SkuAttribute | null>;
  finByValueAndProductId(value: string, productId: number): Promise<any[]>;
  findByProductId: (productId: number) => Promise<any[]>;
  findDefaultSkuAttriutes: (skuId: number) => Promise<any[]>;
}
