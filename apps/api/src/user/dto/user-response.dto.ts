// apps/api/src/user/dto/user-response.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserSchema, ProfileSchema } from 'shared-types/zod';

// Schema para la respuesta de usuario (sin password)
export const UserResponseSchema = UserSchema.omit({ password: true }).extend({
  profile: ProfileSchema.nullable().optional(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export type UserResponse = z.infer<typeof UserResponseSchema>;
