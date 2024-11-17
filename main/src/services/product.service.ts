import { inject, injectable } from "inversify";
import {
  Attribute,
  CreateAttribute,
  CreateProduct,
  CreateSku,
  CreateSkuAtrribute,
  Product,
  Sku,
} from "src/database/schemas";
import { CreateProductDto } from "src/dtos";
import { IPriceRepository } from "src/repositories";
import { IAttributeRepository } from "src/repositories/attribute.repository";
import {
  IProductRepository,
  ProductWithRelation,
} from "src/repositories/product.repository";
import { ISkuAttributeRepository } from "src/repositories/sku-attribute.repository";
import { ISkuRepository } from "src/repositories/sku.repository";
import { INTERFACE_NAME } from "src/shared/constants";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import logger from "src/utils/logger";

export interface IProductService {
  getProducts(
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
  getProduct(id: number): Promise<ProductWithRelation>;
  createProduct(productData: CreateProductDto): Promise<ProductWithRelation>;
  updateProduct(id: number, product: CreateProduct): Promise<Product>;
  deleteProduct(id: number): Promise<Product>;
  searchProducts(name: string, page: number, limit: number): Promise<Sku[]>;
  getSkusByProductId(productId: number): Promise<Sku[]>;
}

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject(INTERFACE_NAME.ProductRepository)
    private productRepository: IProductRepository,
    @inject(INTERFACE_NAME.SkuRepository)
    private skuRepository: ISkuRepository,
    @inject(INTERFACE_NAME.SkuAttributeRepository)
    private skuAttributeRepository: ISkuAttributeRepository,
    @inject(INTERFACE_NAME.PriceRepository)
    private priceRepository: IPriceRepository
  ) {}

  async searchProducts(name: string, page: number, limit: number) {
    logger.info("Searching products with name: " + name);
    return await this.skuRepository.search(name, page, limit);
  }

  async getProducts(
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
    return await this.productRepository.findWithRelations(
      filters,
      page,
      pageSize
    );
  }

  async getProduct(id: number): Promise<ProductWithRelation> {
    logger.info(id);
    const product = await this.productRepository.findByIdWithRelations(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  async createProduct(
    productData: CreateProductDto
  ): Promise<ProductWithRelation> {
    const { product, details } = productData;
    try {
      // Check if product (SPU) already exists
      const existingProduct = await this.productRepository.findByName(
        product.name
      );
      const productId = existingProduct
        ? existingProduct.id
        : (await this.productRepository.add(product)).id;

      if (!productId) {
        throw new Error("Failed to create or retrieve product ID");
      }
      console.log(productId);
      // Process SKUs
      const createdSkus = await Promise.all(
        details.map(async (sku) => {
          // Create SKU
          const createdSku = await this.skuRepository.add({
            name: sku.name,
            slug: sku.slug,
            productId,
            image: "",
          });

          if (!createdSku?.id) {
            throw new Error(`Failed to create SKU: ${sku.name}`);
          }

          // Add attributes for the SKU
          await Promise.all(
            sku.attributes.map(async (attribute) => {
              await this.skuAttributeRepository.add({
                skuId: createdSku.id,
                attributeId: attribute.attributeId,
                value: attribute.value,
              });
            })
          );

          await Promise.all(
            sku.attributes.map(async (attribute) => {
              await this.priceRepository.add({
                skuId: createdSku.id,
                price: attribute.price,
                activate: true,
                effectiveDate: new Date(),
              });
            })
          );

          return createdSku;
        })
      );

      // Fetch the full product with relations (SPU + SKUs + Attributes)
      const fullProduct =
        await this.productRepository.findByIdWithRelations(productId);

      return fullProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: number, product: CreateProduct): Promise<Product> {
    return await this.productRepository.update(id, product);
  }

  async deleteProduct(id: number): Promise<Product> {
    return await this.productRepository.delete(id);
  }

  async getSkusByProductId(productId: number): Promise<Sku[]> {
    return await this.skuRepository.findByProductId(productId);
  }
}
