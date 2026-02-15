import { z } from 'zod';
import { RoleSchema } from '../../common/enums';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  // Password no se retorna en el objeto User por defecto por seguridad
  role: RoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserDto = z.infer<typeof UserSchema>;

// Alias de compatibilidad para imports existentes
export type User = UserDto;
