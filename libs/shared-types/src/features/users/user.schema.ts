import { z } from 'zod';
import { RoleSchema } from '../../common/enums';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: RoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserDto = z.infer<typeof UserSchema>;

// Alias de compatibilidad para imports existentes
export type User = UserDto;
