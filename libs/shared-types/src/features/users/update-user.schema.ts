import { z } from 'zod';
import { RoleSchema } from '../../common/enums';

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: RoleSchema.optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
