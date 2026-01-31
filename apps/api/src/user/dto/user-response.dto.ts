// apps/api/src/user/dto/user-response.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserSchema, ProfileSchema } from 'shared-types/zod';

// Schema básico para un item de portafolio en la respuesta
export const PortfolioItemResponseSchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string(),
  description: z.string().nullable().optional(),
  imageGallery: z.array(z.string()).optional(),
  dynamicAttributes: z.any().optional(),
});

// Schema para el perfil incluyendo el portafolio
export const ProfileResponseSchema = ProfileSchema.extend({
  portfolio: z.array(PortfolioItemResponseSchema).optional(),
});

// Schema para la respuesta de usuario (sin password)
export const UserResponseSchema = UserSchema.omit({ password: true }).extend({
  profile: ProfileResponseSchema.nullable().optional(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export type UserResponse = z.infer<typeof UserResponseSchema>;
