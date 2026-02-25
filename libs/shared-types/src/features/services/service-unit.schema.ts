import { z } from 'zod';

export const ServiceUnitSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  abbreviation: z.string().min(1),
});

export type ServiceUnitDto = z.infer<typeof ServiceUnitSchema>;
