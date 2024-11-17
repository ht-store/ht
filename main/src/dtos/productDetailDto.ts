import { z, TypeOf } from 'zod';
import { idParamsSchema } from './userDto';

// Define the schema for product details
export const productDetailBody = {
  screenSize: z.string({ required_error: 'screenSize is required' }),
  battery: z.string({ required_error: 'battery is required' }),
  camera: z.string({ required_error: 'camera is required' }),
  processor: z.string({ required_error: 'processor is required' }),
  os: z.string({ required_error: 'os is required' }),
};

export const createProductDetailSchema = z.object({
  body: z.object({ ...productDetailBody }),
});

// Type definition for CreateProductDto
export type CreateProductDetailDto = TypeOf<typeof createProductDetailSchema>['body'];

// Create the schema for updating a product
export const updateProductDetailSchema = z.object({
  params: idParamsSchema,
  body: z.object({ ...productDetailBody }).partial(),
});

// Type definition for UpdateProductDto
export type UpdateProductDetailDto = TypeOf<typeof updateProductDetailSchema>['body'];
