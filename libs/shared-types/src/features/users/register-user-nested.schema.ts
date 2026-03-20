import { z } from 'zod';
import { CreateUserSchema } from './create-user.schema';
import { CreateProfileSchema } from '../profiles/profile.schema';

/**
 * Esquema para registro anidado (Usuario + Perfil opcional)
 * Útil para formularios de registro completos.
 */
export const RegisterUserNestedSchema = CreateUserSchema.extend({
  profile: CreateProfileSchema.optional(),
});

export type RegisterUserNestedDto = z.infer<typeof RegisterUserNestedSchema>;
