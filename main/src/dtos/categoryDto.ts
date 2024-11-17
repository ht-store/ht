import { z, TypeOf } from 'zod';
import { idParamsSchema } from './userDto';
import { CategoryName } from 'src/shared/enums/category';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.nativeEnum(CategoryName, { required_error: 'name category is required' }),
  }),
});

export type CreateCategoryDto = TypeOf<typeof createCategorySchema>['body'];

export const updateCategorySchema = z.object({
  params: idParamsSchema,
  body: z.object({
    name: z.nativeEnum(CategoryName, { required_error: 'name category is required' }),
  }),
});

export type UpdateCategoryDto = TypeOf<typeof updateCategorySchema>['body'];
