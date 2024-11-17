import { TypeOf, z } from 'zod';
import { userBodySchema } from './userDto';

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});

export type LoginDto = TypeOf<typeof loginSchema>['body'];

export const registerSchema = z.object({
  body: z.object(userBodySchema),
});

export type RegisterDto = TypeOf<typeof registerSchema>['body'];

export const refreshTokenSchema = z.object({
  query: z.object({
    refresh_token: z.string({ required_error: 'refresh token is required' }),
  }),
});

export type RefreshTokenDto = TypeOf<typeof refreshTokenSchema>['query'];
