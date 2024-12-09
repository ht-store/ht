import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import md5 from 'md5'
import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { CreateProduct, Product, Sku } from "src/shared/database/schemas";
import { NotFoundError } from "src/shared/errors";
import {
  IPriceRepository,
  IProductRepository,
  ISkuAttributeRepository,
  ISkuRepository,
} from "src/shared/interfaces/repositories";
import { IProductService, IWarrantyService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import {
  AttributesType,
  CreateProductType,
  ProductDetail,
  ProductWithRelation,
  UploadedImageType,
} from "src/shared/types";

@injectable()
export class ProductService implements IProductService {
  private s3Client: S3Client;
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository,
    @inject(TYPES.SkuRepository)
    private skuRepository: ISkuRepository,
    @inject(TYPES.SkuAttributeRepository)
    private skuAttributeRepository: ISkuAttributeRepository,
    @inject(TYPES.PriceRepository)
    private priceRepository: IPriceRepository,
  ) {
    this.s3Client = this.createS3Client();
  }
  
  async searchProducts(name: string | null, page: number, limit: number, brandId: number | null) {
    console.log("Searching products with name: " + name);
    return await this.skuRepository.search(name, page, limit, brandId);
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
      await this.createSku(productId, details)
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
    const sku = await this.skuRepository.findBySkuId(skuId);
    return sku
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
    const flattenedStorages = skustorages.flat();
    const uniqueStorages = Array.from(
      new Map(flattenedStorages.map((storage) => [storage?.value, storage])).values()
    );
  
    return uniqueStorages;
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

  async updateProductSku(
    productId: number,
    skuId: number,
    productData: CreateProductType
  ): Promise<void> {
    const { product, details } = productData;
    try {
      const existingProduct = await this.productRepository.findById(productId);
  
      if (existingProduct) {
        const needsNewProduct = this.shouldCreateNewProduct(existingProduct, product as Product);
  
        if (needsNewProduct) {
          await this.handleProductReplacement(product, details, skuId);
        } else {
          await this.skuRepository.update(skuId, details[0]);
        }
      } else {
        await this.createNewProductWithSku(product, details);
      }
    } catch (error) {
      console.error("Error updating product SKU:", error);
      throw error;
    }
  }

  async deleteProductSku(skuId: number): Promise<Sku> {
    try {
      
      const skuAttributes = await this.skuAttributeRepository.findBySkuId(skuId);
      await Promise.all(
        skuAttributes.map(skuAttr => this.skuAttributeRepository.delete(skuAttr.id))
      );
      return await this.skuRepository.delete(skuId);
    } catch (error) {
      throw error;
    }
  }

  async handleUploadImage(image: Express.Multer.File, uploadPrefix: string): Promise<UploadedImageType> {
    const imageData = image.buffer;
    const extension = image.originalname.split(".").pop(); // Lấy phần mở rộng file
    const imageNameWithoutExt = image.originalname.split(".").slice(0, -1).join("."); // Tên file không có đuôi mở rộng

    // Tạo hash MD5 từ tên image và thời gian hiện tại để tránh trùng lặp
    const hash = md5(imageNameWithoutExt.trim() + Date.now());
    const fullImageName = `${uploadPrefix}${hash}.${extension}`; // Tạo tên file
    await this.putObjCommand(fullImageName, imageData);

    const path = `${process.env.CLOUDFLARE_IMG_PATH}${fullImageName}`;

    return { name: fullImageName, path };
  }

  private createS3Client(): S3Client {
    return new S3Client({
      region: "auto",
      endpoint: process.env.CLOUDFLARE_ENDPOINT,
      credentials: {  
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
      },
      forcePathStyle: true,
    });
  }

  private async putObjCommand(fileName: string, data: any): Promise<PutObjectCommandOutput> {
    try {
      const res: PutObjectCommandOutput = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_SKUS_BUCKET_NAME,
          Key: fileName,
          Body: data,
          ContentType: "image/png", // Đảm bảo phần này là đúng loại nội dung
        })
      );
      return res
    } catch (error) {
      console.error("Error uploading object to R2 bucket:", error);
      throw error;
    }
  }

  private async createSku(productId: number, details: ProductDetail[]) {
    try {
      await Promise.all(
        details.map(async (sku) => {
          // Create SKU
          const createdSku = await this.skuRepository.add({
            name: sku.name,
            slug: sku.slug,
            productId,
            image: sku.image || process.env.IMG_DEFAULT_URL!,
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
    } catch (error) {
      throw error
    }
  }

  private shouldCreateNewProduct(
    existingProduct: Product, 
    newProduct: Product
  ): boolean {
    const fieldsToCheck = [
      'battery', 'brandId', 'camera', 'categoryId', 
      'image', 'originalPrice', 'os', 
      'processor', 'screenSize'
    ] as const;
  
    return fieldsToCheck.some(field => 
      existingProduct[field] !== newProduct[field]
    );
  }
  
  private async handleProductReplacement(
    product: Partial<Product>, 
    details: ProductDetail[], 
    skuId: number
  ): Promise<void> {
    const newProduct = await this.productRepository.add(product as Product);
    await this.createSku(newProduct.id, details);
    await this.skuRepository.delete(skuId);
  }
  
  private async createNewProductWithSku(
    product: Partial<Product>, 
    details: ProductDetail[]
  ): Promise<void> {
    const newProduct = await this.productRepository.add(product as Product);
    await this.createSku(newProduct.id, details);
  }
}
