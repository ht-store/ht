import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { CreateProduct, Product, Sku } from "src/shared/database/schemas ";
import { NotFoundError } from "src/shared/errors";
import {
  IPriceRepository,
  IProductRepository,
  ISkuAttributeRepository,
  ISkuRepository,
} from "src/shared/interfaces/repositories";
import { IProductService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import {
  AttributesType,
  CreateProductType,
  ProductWithRelation,
} from "src/shared/types";

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository,
    @inject(TYPES.SkuRepository)
    private skuRepository: ISkuRepository,
    @inject(TYPES.SkuAttributeRepository)
    private skuAttributeRepository: ISkuAttributeRepository,
    @inject(TYPES.PriceRepository)
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
    productData: CreateProductType
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

          await this.priceRepository.add({
            skuId: createdSku.id,
            price: sku.price,
            activate: true,
            effectiveDate: new Date(),
          });

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

  async updateProduct(
    id: number,
    product: Partial<CreateProduct>
  ): Promise<Product> {
    return await this.productRepository.update(id, product);
  }

  async deleteProduct(id: number): Promise<Product> {
    return await this.productRepository.delete(id);
  }

  async getSkusByProductId(productId: number): Promise<Sku[]> {
    return await this.skuRepository.findByProductId(productId);
  }

  async getDetails(skuId: number): Promise<any> {
    const skus = await this.skuRepository.findBySkuId(skuId);
    if (!skus.length) {
      throw new NotFoundError("SKU not found");
    }
    const atributes = await this.skuRepository.findByProductId(
      skus[0].products.id
    );
    return {
      skus,
      atributes: atributes,
    };
  }

  async getStorages(value: string, productId: number) {
    const skus = await this.skuAttributeRepository.finByValueAndProductId(
      value,
      productId
    ); // Tìm theo giá trị

    // Sử dụng Promise.all để xử lý tất cả các truy vấn bất đồng bộ
    const skustorages = await Promise.all(
      skus.map((attribute) =>
        this.skuAttributeRepository.findBySkuIdAndAttributeId(
          attribute.skuId,
          attribute.attributeId
        )
      )
    );

    return skustorages;
  }

  async getDetail(productId: number, skuId: number) {
    const product = await this.productRepository.findDetail(productId, skuId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    const attributes = await this.getAttributesByProductId(productId);
    return {
      product,
      attributes,
    };
  }

  async getAttributesByProductId(productId: number) {
    const attributes =
      await this.skuAttributeRepository.findByProductId(productId);
    const uniqueAttributes = Array.from(
      new Map(attributes.map((item) => [item.value, item])).values()
    );
    const colorAttributes = uniqueAttributes.filter(
      (item) => item.type === "Color"
    );
    const groupedByAttributeId = colorAttributes.reduce<
      Record<number, AttributesType[]>
    >((acc, item) => {
      const key = item.type;
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});
    return groupedByAttributeId;
  }
}
