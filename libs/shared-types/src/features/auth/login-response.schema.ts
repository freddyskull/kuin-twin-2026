import { z } from 'zod';
import { UserSchema } from '../users/user.schema';

export const LoginResponseSchema = z.object({
  access_token: z.string(),
  user: UserSchema.pick({ id: true, email: true, role: true }),
});

export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;
