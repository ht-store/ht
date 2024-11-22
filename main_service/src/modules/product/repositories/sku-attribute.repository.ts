import { injectable } from "inversify";
import { and, eq, ne } from "drizzle-orm";
import { Repository } from "src/shared/base-repository";
import {
  attributes,
  prices,
  products,
  SkuAttribute,
  skuAttributes,
  skus,
} from "src/shared/database/schemas ";
import { ISkuAttributeRepository } from "src/shared/interfaces/repositories";
import { logger } from "src/shared/middlewares";

@injectable()
export class SkuAttributeRepository
  extends Repository<SkuAttribute>
  implements ISkuAttributeRepository
{
  constructor() {
    super(skuAttributes);
  }

  async findBySkuId(skuId: number): Promise<SkuAttribute[]> {
    try {
      return (await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.skuId, skuId))) as SkuAttribute[];
    } catch (error) {
      logger.error("Error in findBySkuId:", error);
      throw error;
    }
  }

  async findByAttributeId(attributeId: number): Promise<SkuAttribute[]> {
    try {
      return (await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.attributeId, attributeId))) as SkuAttribute[];
    } catch (error) {
      logger.error("Error in findByAttributeId:", error);
      throw error;
    }
  }

  async findBySkuIdAndAttributeId(
    skuId: number,
    attributeId: number
  ): Promise<any | null> {
    try {
      const [result] = await this.db
        .select({
          id: skuAttributes.id,
          value: skuAttributes.value,
          skuId: skuAttributes.skuId,
        })
        .from(skuAttributes)
        .where(
          and(
            eq(skuAttributes.skuId, skuId),
            ne(skuAttributes.attributeId, attributeId)
          )
        );
      return result;
    } catch (error) {
      logger.error("Error in findBySkuIdAndAttributeId:", error);
      throw error;
    }
  }

  async finByValueAndProductId(
    value: string,
    productId: number
  ): Promise<any[]> {
    try {
      const result = await this.db
        .select({
          skuId: skus.id,
          attributeId: attributes.id,
        })
        .from(skuAttributes)
        .innerJoin(skus, eq(skus.id, skuAttributes.skuId))
        .innerJoin(products, eq(products.id, skus.productId))
        .innerJoin(attributes, eq(skuAttributes.attributeId, attributes.id))
        .where(and(eq(skuAttributes.value, value), eq(products.id, productId)));
      return result;
    } catch (error) {
      logger.error("Error in finByValue:", error);
      throw error;
    }
  }

  async findByProductId(productId: number): Promise<any[]> {
    try {
      return (await this.db
        .select({
          id: skuAttributes.id,
          skuId: skuAttributes.skuId,
          attributeId: skuAttributes.attributeId,
          type: attributes.type,
          value: skuAttributes.value,
          colorImage: skus.image,
          price: prices.price,
        })
        .from(skuAttributes)
        .innerJoin(skus, eq(skus.id, skuAttributes.skuId))
        .innerJoin(prices, eq(prices.skuId, skus.id))
        .innerJoin(products, eq(products.id, skus.productId))
        .innerJoin(attributes, eq(attributes.id, skuAttributes.attributeId))
        .where(eq(products.id, productId))) as any[];
    } catch (error) {
      logger.error("Error in findByProductId:", error);
      throw error;
    }
  }

  async findDefaultSkuAttriutes(skuId: number): Promise<any> {
    const attr = await this.db
      .select()
      .from(skuAttributes)
      .rightJoin(attributes, eq(attributes.id, skuAttributes.attributeId))
      .where(and(eq(skuAttributes.skuId, skuId)));
    return attr;
  }
}
