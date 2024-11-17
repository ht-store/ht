import { z } from 'zod';
import { idParamsSchema } from './userDto';

// Định nghĩa schema cho CartItem
export const cartItemBody = {
  price: z.string(),
  cartId: z.number(),
  productItemId: z.number(),
  quantity: z.number(),
};

export const createCartItemSchema = z.object({
  body: z.object(cartItemBody),
});

// Tạo kiểu TypeScript từ schema
export type CreateCartItemDto = z.infer<typeof createCartItemSchema>['body'];

export const updateCartItemSchema = z.object({
  params: idParamsSchema,
  body: z.object(cartItemBody).partial(),
});

// Tạo kiểu TypeScript từ schema
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>['body'];
