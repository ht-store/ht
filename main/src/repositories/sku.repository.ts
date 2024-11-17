import { prices, Sku, skus } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";
import { ilike, eq, and } from "drizzle-orm";
import logger from "src/utils/logger";

export interface ISkuRepository extends IRepository<Sku> {
  search(name: string, page: number, limit: number): Promise<any[]>;
  findByProductId(productId: number): Promise<any[]>;
  findBySlug(slug: string): Promise<any[]>;
}

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
    logger.info(`Searching for skus with productId ${productId}`);
    return await this.db
      .select()
      .from(skus)
      .leftJoin(
        prices,
        and(eq(skus.id, prices.skuId), eq(prices.activate, true))
      )
      .where(eq(skus.productId, productId));
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
}
