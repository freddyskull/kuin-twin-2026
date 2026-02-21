import { z } from 'zod';
import { ServiceMetadataSchema } from './service-metadata.schema';
import { ServiceSlotSchema } from './service-slot.schema';

export const CreateServiceSchema = z.object({
  vendorId: z.string().uuid('ID de vendedor inválido'),
  categoryId: z.string().uuid('ID de categoría inválido'),
  unitId: z.string().uuid('ID de unidad inválido').nullish(),
  companyId: z.string().uuid('ID de empresa inválido').nullish(),
  
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3).nullish(),
  description: z.string().min(10, 'La descripción es muy corta').nullish(),
  imageUrl: z.string().nullish(), // No forzamos URL por si es path local
  tags: z.array(z.string()).default([]),
  
  basePrice: z.number().nonnegative().default(0).nullish(),
  showPrice: z.boolean().default(true),
  isActive: z.boolean().default(true),
  
  metadata: z.array(ServiceMetadataSchema).default([]),
  dynamicAttributes: z.record(z.any()).nullish(),
  workSchedule: z.any().nullish(),
  commentsBox: z.any().nullish(),
  
  slots: z.array(ServiceSlotSchema).default([]),
  branchIds: z.array(z.string().uuid()).default([]),
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
