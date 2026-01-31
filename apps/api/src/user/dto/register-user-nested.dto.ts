import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CreateUserSchema } from './create-user.dto';
import { CreateProfileSchema } from './create-profile.dto';

/**
 * Schema para registro anidado (Usuario + Perfil)
 */
export const RegisterUserNestedSchema = CreateUserSchema.extend({
  profile: CreateProfileSchema.optional(),
});

export class RegisterUserNestedDto extends createZodDto(RegisterUserNestedSchema) {}
export type RegisterUserNestedInput = z.infer<typeof RegisterUserNestedSchema>;
