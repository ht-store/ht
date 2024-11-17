import { z } from 'zod';
import { idParamsSchema } from './userDto';

// Định nghĩa schema cho ProductItem
const productItemBody = {
  image: z.string(),
  status: z.enum(['locked', 'unlock', 'sold']),
  SKU: z.string(),
  quantityInStock: z.number(),
  price: z.string(),
  color: z.string(),
  ram: z.string({ required_error: 'ram is required' }),
  storage: z.string({ required_error: 'storage is required' }),
  productId: z.number(),
};

export const createProductItemSchema = z.object({
  body: z.object(productItemBody),
});

// Tạo kiểu TypeScript từ schema
export type CreateProductItemDto = z.infer<typeof createProductItemSchema>['body'];

export const updateProductItemSchema = z.object({
  params: idParamsSchema,
  body: z.object(productItemBody),
});

// Tạo kiểu TypeScript từ schema
export type UpdateProductItemDto = z.infer<typeof updateProductItemSchema>['body'];
