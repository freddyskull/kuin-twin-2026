import { z } from 'zod';
import { UserSchema } from './user.schema';
import { ProfileSchema, PortfolioItemSchema } from '../profiles';

export const UserResponseSchema = UserSchema.extend({
  profile: ProfileSchema.extend({
    portfolio: z.array(PortfolioItemSchema).optional(),
  }).nullable().optional(),
});

export type UserResponseDto = z.infer<typeof UserResponseSchema>;
