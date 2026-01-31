// apps/api/src/user/dto/create-user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { RoleSchema } from 'shared-types/zod';

// Schema para crear un usuario (sin relaciones anidadas)
export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: RoleSchema.optional(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
