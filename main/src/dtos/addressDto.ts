import { z, TypeOf } from 'zod';
import { idParamsSchema } from './userDto';

export const addressBodySchema = {
  streetAddress: z.string({ required_error: 'streetAddress is required' }),
  wardOrCommune: z.string({ required_error: 'wardOrCommune is required' }),
  district: z.string({ required_error: 'district is required' }),
  cityOrProvince: z.string({ required_error: 'cityOrProvince is required' }),
};

export const createAddressSchema = z.object({
  body: z.object(addressBodySchema),
});

export type CreateAddressDto = TypeOf<typeof createAddressSchema>['body'];

export const updateAddressSchema = z.object({
  params: idParamsSchema,
  body: z.object(addressBodySchema).partial(),
});

export type UpdateAddressDto = TypeOf<typeof updateAddressSchema>['body'];
