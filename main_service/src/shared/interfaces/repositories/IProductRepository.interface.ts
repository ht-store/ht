import { Product } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";
import { ProductWithRelation } from "src/shared/types/product.type";

export interface IProductRepository extends IRepository<Product> {
  findDetail(productId: number, skuId: number): Promise<any>;
  findByName(name: string): Promise<Product | null>;
  findByIdWithRelations(id: number): Promise<ProductWithRelation>;
  findWithRelations(
    filters: {
      name?: string;
      brandId?: number;
      categoryId?: number;
      minPrice?: number;
      maxPrice?: number;
    },
    page: number,
    pageSize: number
  ): Promise<ProductWithRelation[]>;
}
