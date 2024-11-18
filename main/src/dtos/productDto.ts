import { z } from "zod";

const skuSchema = z.object({
  attributeId: z.number(), // Link to attribute definition
  value: z.string(), // Example: "512GB", "Red"
});

// Define product schema
const createProductSchema = z.object({
  product: z.object({
    screenSize: z.string(),
    battery: z.string(),
    camera: z.string(),
    processor: z.string(),
    os: z.string(),
    name: z.string(),
    brandId: z.number(),
    categoryId: z.number(),
    image: z.string(),
    originalPrice: z.string(),
    id: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  details: z.array(
    z.object({
      name: z.string(),
      slug: z.string(),
      attributes: z.array(skuSchema),
      price: z.string(), // Example: Specific SKU price
    })
  ),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
const getProductsFilterSchema = z.object({
  name: z.string().optional(),
  brandId: z.number().optional(),
  categoryId: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

// Define the pagination schema
const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

// Combine both schemas for the full `getProducts` DTO
export const getProductsDto = z.object({
  filters: getProductsFilterSchema,
  pagination: paginationSchema,
});

export type GetProductsDto = z.infer<typeof getProductsDto>;
