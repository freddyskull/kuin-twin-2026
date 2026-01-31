// apps/api/src/user/dto/update-user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { RoleSchema } from 'shared-types/zod';

// Schema para actualizar un usuario (todos los campos opcionales)
export const UpdateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
  role: RoleSchema.optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
