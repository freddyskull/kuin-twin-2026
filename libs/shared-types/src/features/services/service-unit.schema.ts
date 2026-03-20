import { z } from 'zod';

export const ServiceUnitSchema = z.object({
  id: z.string().uuid('ID de unidad inválido'),
  name: z.string().min(1, 'El nombre de la unidad es requerido'),
  abbreviation: z.string().min(1, 'La abreviación de la unidad es requerida'),
});

export type ServiceUnitDto = z.infer<typeof ServiceUnitSchema>;
