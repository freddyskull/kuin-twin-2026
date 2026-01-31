import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateServiceUnitSchema = z.object({
  name: z.string().min(1, 'el nombre es requerido'),
  abbreviation: z.string().min(1, 'la abreviación es requerida'),
});

export class CreateServiceUnitDto extends createZodDto(CreateServiceUnitSchema) {}
export type CreateServiceUnitInput = z.infer<typeof CreateServiceUnitSchema>;

export const UpdateServiceUnitSchema = CreateServiceUnitSchema.partial();
export class UpdateServiceUnitDto extends createZodDto(UpdateServiceUnitSchema) {}
