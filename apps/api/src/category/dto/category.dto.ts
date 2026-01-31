import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres').optional().nullable(),
  imageUrl: z.string().url('URL de imagen inválida').optional().nullable(),
  parentId: z.string().uuid('ID de categoría padre inválido').optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
