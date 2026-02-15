import { z } from 'zod';
import { RoleSchema } from '../../common/enums';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: RoleSchema.default('CUSTOMER'),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
