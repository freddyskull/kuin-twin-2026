import { z } from 'zod';

export const ServiceMetadataSchema = z.object({
  key: z.string().min(1, 'La clave es requerida'),
  value: z.string().min(1, 'El valor es requerido'),
});

export type ServiceMetadataDto = z.infer<typeof ServiceMetadataSchema>;
