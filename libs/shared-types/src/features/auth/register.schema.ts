import { z } from 'zod';
import { RoleSchema } from '../../common/enums';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: RoleSchema.default('CUSTOMER'),
  // Campos básicos de usuario
  displayName: z.string().min(1, 'El nombre es obligatorio'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
