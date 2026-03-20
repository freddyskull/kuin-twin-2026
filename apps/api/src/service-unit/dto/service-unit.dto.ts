import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateServiceUnitSchema = z.object({
  name: z.string().min(1, { message: 'el nombre es requerido' }),
  abbreviation: z.string().min(1, { message: 'la abreviación es requerida' }),
});

export class CreateServiceUnitDto extends createZodDto(CreateServiceUnitSchema) {}

export type CreateServiceUnitInput = CreateServiceUnitDto;

export const UpdateServiceUnitSchema = CreateServiceUnitSchema.partial();

export class UpdateServiceUnitDto extends createZodDto(UpdateServiceUnitSchema) {}
