import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateServiceSchema = z.object({
  vendorId: z.string().uuid('ID de vendedor inválido'),
  categoryId: z.string().uuid('ID de categoría inválido'),
  unitId: z.string().uuid('ID de unidad inválido'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().max(1000, 'La descripción no puede exceder los 1000 caracteres').optional().nullable(),
  imageUrl: z.string().url('URL de imagen inválida').optional().nullable(),
  basePrice: z.number().positive('El precio base debe ser mayor a 0'),
  isActive: z.boolean().optional().default(true),
  dynamicAttributes: z.any().optional().nullable(),
});

export class CreateServiceDto extends createZodDto(CreateServiceSchema) {}
export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;

export const UpdateServiceSchema = CreateServiceSchema.partial();
export class UpdateServiceDto extends createZodDto(UpdateServiceSchema) {}
