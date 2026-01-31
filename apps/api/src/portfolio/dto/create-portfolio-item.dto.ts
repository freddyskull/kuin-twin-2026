import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Schema para crear un item del portafolio con galería y atributos dinámicos
 */
export const CreatePortfolioItemSchema = z.object({
  imageUrl: z.string().url('URL de imagen principal inválida'),
  description: z.string().max(1000, 'La descripción no puede exceder los 1000 caracteres').optional().nullable(),
  imageGallery: z.array(z.string().url()).optional().default([]),
  dynamicAttributes: z.any().optional().nullable(), // JSON
});

export class CreatePortfolioItemDto extends createZodDto(CreatePortfolioItemSchema) {}
export type CreatePortfolioItemInput = z.infer<typeof CreatePortfolioItemSchema>;
