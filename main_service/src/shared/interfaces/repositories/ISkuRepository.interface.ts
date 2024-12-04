import { Sku } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface ISkuRepository extends IRepository<Sku> {
  search(name: string | null, page: number, limit: number, brandId: number | null): Promise<any[]>;
  findByProductId(productId: number): Promise<any[]>;
  findBySlug(slug: string): Promise<any[]>;
  findBySkuId(skuId: number): Promise<any[]>;
  getColorStorageCombinations(skuId: number): Promise<
    {
      color: string;
      storage: string;
    }[]
  >;
  getSkuWithAttributes(skuId: number): Promise<{
    sku: {
      id: number;
      name: string;
      image: string;
      createdAt: Date;
      updatedAt: Date;
      productId: number;
      slug: string;
    };
    attributes: {
      value: string;
      attributeType: string;
    }[];
  }>;
}
