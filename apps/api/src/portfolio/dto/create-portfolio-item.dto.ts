import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * DTO para crear un item del portafolio con galería y atributos dinámicos
 */
export const CreatePortfolioItemSchema = z.object({
  imageUrl: z.string().url({ message: 'URL de imagen principal inválida' }),
  description: z.string().max(1000, { message: 'La descripción no puede exceder los 1000 caracteres' }).optional(),
  imageGallery: z.array(z.string().url()).optional().default([]),
  dynamicAttributes: z.any().optional(),
});

export class CreatePortfolioItemDto extends createZodDto(CreatePortfolioItemSchema) {}

export type CreatePortfolioItemInput = CreatePortfolioItemDto;
