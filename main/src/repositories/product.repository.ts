import {
  Attribute,
  attributes,
  Product,
  products,
  Sku,
  SkuAttribute,
  skuAttributes,
} from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";
import { eq, sql, like, gte, lte } from "drizzle-orm";
import { skus } from "src/database/schemas";

export type ProductWithRelation = Product & {
  skus: Sku[];
  skuAttributes: SkuAttribute[];
};

export interface IProductRepository extends IRepository<Product> {
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

@injectable()
export class ProductRepository
  extends Repository<Product>
  implements IProductRepository
{
  constructor() {
    super(products);
  }

  async findByName(name: string): Promise<Product | null> {
    return await this.db
      .select()
      .from(products)
      .where(eq(products.name, name))
      .then((res) => res[0] ?? null);
  }

  async findByIdWithRelations(id: number): Promise<ProductWithRelation> {
    const product = await this.db
      .select({
        id: products.id,
        name: products.name,
        image: products.image,
        originalPrice: products.originalPrice,
        brandId: products.brandId,
        categoryId: products.categoryId,
        screenSize: products.screenSize,
        battery: products.battery,
        camera: products.camera,
        processor: products.processor,
        os: products.os,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        // Subquery for SKUs as JSON array
        skus: sql<Sku[]>`
          COALESCE(
            JSON_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                'id', ${skus.id},
                'name', ${skus.name},
                'slug', ${skus.slug},
                'created_at', ${skus.createdAt},
                'updated_at', ${skus.updatedAt}
              )
            ) FILTER (WHERE ${skus.id} IS NOT NULL),
            '[]'
          )
        `,
        // Subquery for SKU attributes as JSON array
        skuAttributes: sql<SkuAttribute[]>`
          COALESCE(
            JSON_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                'id', ${skuAttributes.id},
                'sku_id', ${skuAttributes.skuId},
                'attribute_id', ${skuAttributes.attributeId},
                'value', ${skuAttributes.value},
                'created_at', ${skuAttributes.createdAt},
                'updated_at', ${skuAttributes.updatedAt},
                'attribute', JSONB_BUILD_OBJECT(
                  'id', ${attributes.id},
                  'type', ${attributes.type}
                )
              )
            ) FILTER (WHERE ${skuAttributes.id} IS NOT NULL),
            '[]'
          )
        `,
      })
      .from(products)
      .leftJoin(skus, eq(products.id, skus.productId))
      .leftJoin(skuAttributes, eq(skus.id, skuAttributes.skuId))
      .leftJoin(attributes, eq(skuAttributes.attributeId, attributes.id))
      .where(eq(products.id, id))
      .groupBy(products.id);

    return product[0];
  }

  async findWithRelations(
    filters: {
      name?: string;
      brandId?: number;
      categoryId?: number;
      minPrice?: number;
      maxPrice?: number;
    },
    page: number = 1,
    pageSize: number = 20
  ): Promise<ProductWithRelation[]> {
    const query = this.db
      .select({
        id: products.id,
        name: products.name,
        image: products.image,
        originalPrice: products.originalPrice,
        brandId: products.brandId,
        categoryId: products.categoryId,
        screenSize: products.screenSize,
        battery: products.battery,
        camera: products.camera,
        processor: products.processor,
        os: products.os,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        skus: sql<Sku[]>`
          COALESCE(
            JSON_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                'id', ${skus.id},
                'name', ${skus.name},
                'slug', ${skus.slug},
                'created_at', ${skus.createdAt},
                'updated_at', ${skus.updatedAt}
              )
            ) FILTER (WHERE ${skus.id} IS NOT NULL),
            '[]'
          )
        `,
        skuAttributes: sql<SkuAttribute[]>`
          COALESCE(
            JSON_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                'id', ${skuAttributes.id},
                'sku_id', ${skuAttributes.skuId},
                'attribute_id', ${skuAttributes.attributeId},
                'value', ${skuAttributes.value},
                'created_at', ${skuAttributes.createdAt},
                'updated_at', ${skuAttributes.updatedAt},
                'attribute', JSONB_BUILD_OBJECT(
                  'id', ${attributes.id},
                  'type', ${attributes.type}
                )
              )
            ) FILTER (WHERE ${skuAttributes.id} IS NOT NULL),
            '[]'
          )
        `,
      })
      .from(products)
      .leftJoin(skus, eq(products.id, skus.productId))
      .leftJoin(skuAttributes, eq(skus.id, skuAttributes.skuId))
      .leftJoin(attributes, eq(skuAttributes.attributeId, attributes.id))
      .groupBy(products.id);

    // Apply filters
    if (filters.name) {
      query.where(like(products.name, `%${filters.name}%`));
    }
    if (filters.brandId) {
      query.where(eq(products.brandId, filters.brandId));
    }
    if (filters.categoryId) {
      query.where(eq(products.categoryId, filters.categoryId));
    }
    if (typeof filters.minPrice !== "undefined") {
      query.where(
        gte(products.originalPrice, sql`${filters.minPrice}::numeric`)
      );
    }
    if (typeof filters.maxPrice !== "undefined") {
      query.where(
        lte(products.originalPrice, sql`${filters.minPrice}::numeric`)
      );
    }

    // Apply pagination
    query.offset((page - 1) * pageSize);
    query.limit(pageSize);

    return await query;
  }
}
