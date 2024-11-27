import { injectable } from "inversify";
import { ilike, eq, and, or } from "drizzle-orm";
import { Repository } from "src/shared/base-repository";
import {
  attributes,
  prices,
  products,
  Sku,
  skuAttributes,
  skus,
} from "src/shared/database/schemas";
import { ISkuRepository } from "src/shared/interfaces/repositories";
import { logger } from "src/shared/middlewares";

@injectable()
export class SkuRepository extends Repository<Sku> implements ISkuRepository {
  constructor() {
    super(skus);
  }

  async search(name: string, page: number, limit: number) {
    logger.info(`Searching for skus with name ${name}`);
    return await this.db
      .select()
      .from(skus)
      .leftJoin(
        prices,
        and(eq(skus.id, prices.skuId), eq(prices.activate, true))
      )
      .where(ilike(skus.name, `%${name}%`));
  }

  async findByProductId(productId: number) {
    const data = await this.db
      .select()
      .from(skus)
      .innerJoin(
        prices,
        and(eq(skus.id, prices.skuId), eq(prices.activate, true))
      )
      .innerJoin(
        products,
        and(eq(skus.productId, products.id), eq(products.id, productId))
      )
      .innerJoin(skuAttributes, eq(skuAttributes.skuId, skus.id))
      .innerJoin(attributes, eq(attributes.id, skuAttributes.attributeId))
      .where(eq(skus.productId, productId));
      return Array.from(
        new Map(data.map((item) => [item.skus.id, item])).values()
      );
  }

  async findBySkuId(skuId: number) {
    logger.info(`Searching for skus with skuId ${skuId}`);
    return await this.db
      .select()
      .from(skus)
      .innerJoin(
        prices,
        and(eq(skus.id, prices.skuId), eq(prices.activate, true))
      )
      .innerJoin(products, eq(skus.productId, products.id))
      .innerJoin(skuAttributes, eq(skuAttributes.skuId, skuId))
      .where(eq(skus.id, skuId));
  }

  async findBySlug(slug: string) {
    logger.info(`Searching for sku with slug ${slug}`);
    return await this.db
      .select()
      .from(skus)
      .leftJoin(
        prices,
        and(eq(skus.id, prices.skuId), eq(prices.activate, true))
      )
      .where(eq(skus.slug, slug));
  }

  async getSkuWithAttributes(skuId: number) {
    const sku = await this.db
      .select()
      .from(skus)
      .where(eq(skus.id, skuId))
      .limit(1)
      .execute();
    if (sku.length === 0) throw new Error("SKU not found");

    // Get associated attributes for this SKU (like color and storage)
    const skuAttr = await this.db
      .select({ value: skuAttributes.value, attributeType: attributes.type })
      .from(skuAttributes)
      .innerJoin(attributes, eq(skuAttributes.attributeId, attributes.id))
      .where(eq(skuAttributes.skuId, skuId))
      .execute();

    return {
      sku: sku[0], // SKU details
      attributes: skuAttr, // SKU attributes like color and storage
    };
  }

  // Fetch combinations of color and storage for SKU
  async getColorStorageCombinations(skuId: number) {
    const combinations = await this.db
      .select({
        color: skuAttributes.value,
        storage: skuAttributes.value,
      })
      .from(skuAttributes)
      .innerJoin(attributes, eq(skuAttributes.attributeId, attributes.id))
      .where(
        and(
          eq(skuAttributes.skuId, skuId),
          or(eq(attributes.type, "color"), eq(attributes.type, "storage"))
        )
      )
      .execute();

    return combinations;
  }
}
