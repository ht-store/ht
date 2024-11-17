import { z, TypeOf } from 'zod';
import { idParamsSchema } from './userDto';

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name brand is required' }),
  }),
});

export type CreateBrandDto = TypeOf<typeof createBrandSchema>['body'];

export const updateBrandSchema = z.object({
  params: idParamsSchema,
  body: z
    .object({
      name: z.string({ required_error: 'name brand is required' }),
    })
    .partial(),
});

export type UpdateBrandDto = TypeOf<typeof updateBrandSchema>['body'];
