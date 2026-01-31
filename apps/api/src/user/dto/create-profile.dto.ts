import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Schema para la creación de un perfil
 */
export const CreateProfileSchema = z.object({
  displayName: z.string().min(2, 'El nombre mostrado debe tener al menos 2 caracteres'),
  bio: z.string().max(500, 'La biografía no puede exceder los 500 caracteres').optional().nullable(),
  avatarUrl: z.string().url('URL de avatar inválida').optional().nullable(),
  serviceRadiusKm: z.number().int().min(1).max(500).optional().default(10),
  businessHours: z.any().optional().nullable(), // JSON
});

export class CreateProfileDto extends createZodDto(CreateProfileSchema) {}
export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
