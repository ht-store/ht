import { CreateProduct, Product, Sku } from "src/shared/database/schemas";
import {
  AttributesType,
  CreateProductType,
  ProductWithRelation,
  UploadedImageType,
} from "src/shared/types/product.type";

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
  createProduct(productData: CreateProductType): Promise<ProductWithRelation>;
  updateProduct(id: number, product: Partial<CreateProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<Product>;
  searchProducts(name: string, page: number, limit: number): Promise<Sku[]>;
  getSkusByProductId(productId: number): Promise<Sku[]>;
  getDetails(skuId: number): Promise<any>;
  getDetail(productId: number, skuId: number): Promise<any>;
  getAttributesByProductId(
    productId: number
  ): Promise<Record<number, AttributesType[]>>;
  getStorages(value: string, productId: number): Promise<any>;
  handleUploadImage(image: Express.Multer.File, uploadPrefix: string): Promise<UploadedImageType>
  updateProductSku(productid: number, skuId: number, productData: CreateProductType): Promise<void>
}
