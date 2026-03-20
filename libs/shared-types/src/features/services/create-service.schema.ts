import { z } from 'zod';
import { ServiceMetadataSchema } from './service-metadata.schema';
import { ServiceSlotSchema } from './service-slot.schema';

export const CreateServiceBaseSchema = z.object({
  vendorId: z.string().uuid('ID de vendedor inválido'),
  categoryId: z.string().uuid('ID de categoría inválido'),
  unitId: z.string().uuid('ID de unidad inválido').nullish(),
  companyId: z.string().uuid('ID de empresa inválido').nullish(),
  
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100, 'El título es demasiado largo'),
  slug: z.string().min(3, 'El slug es demasiado corto').max(120, 'El slug es demasiado largo').nullish(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(2000, 'La descripción es demasiado larga').nullish(),
  imageUrl: z.string().nullish(), 
  imageGallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  
  basePrice: z.number().nonnegative('El precio no puede ser negativo').default(0).nullish(),
  showPrice: z.boolean().default(true),
  isActive: z.boolean().default(true),
  
  metadata: z.array(ServiceMetadataSchema).default([]),
  dynamicAttributes: z.any().nullish(),
  workSchedule: z.any().nullish(),
  commentsBox: z.any().nullish(),
  
  faqs: z.array(z.object({
    question: z.string().min(5, 'La pregunta es muy corta'),
    answer: z.string().min(5, 'La respuesta es muy corta'),
    order: z.number().int().default(0),
  })).default([]),
  
  slots: z.array(ServiceSlotSchema).default([]),
  branchIds: z.array(z.string().uuid('ID de sucursal inválido')).default([]),
  
  // Coordenadas PostGIS
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().max(500).optional(),
});

export const CreateServiceSchema = CreateServiceBaseSchema.refine((data) => {
  if (data.showPrice) {
    return data.basePrice !== null && data.unitId !== null && data.unitId !== '';
  }
  return true;
}, {
  message: "El precio y la unidad son obligatorios si decides mostrar el precio",
  path: ["basePrice"]
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
