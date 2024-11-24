import { CreateProduct, Product, Sku, SkuAttribute } from "../database/schemas";

export type ProductWithRelation = Product & {
  skus: Sku[];
  skuAttributes: SkuAttribute[];
};

export type ProductDetailAttribute = {
  attributeId: number;
  value: string;
};

export type ProductDetail = {
  name: string;
  slug: string;
  attributes: ProductDetailAttribute[];
  price: string;
};

// Define the main product type

// Define the full structure including product and details
export type CreateProductType = {
  product: CreateProduct;
  details: ProductDetail[];
};

export type AttributesType = {
  id: number;
  skuId: number;
  attributeId: number;
  type: string;
  value: string;
  colorImage: string;
  price: string;
};
