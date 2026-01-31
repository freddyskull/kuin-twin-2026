import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { SlotStatus } from '@prisma/client';

export const CreateSlotSchema = z.object({
  serviceId: z.string().uuid('ID de servicio inválido'),
  startTime: z.string().datetime('Formato de fecha de inicio inválido'),
  endTime: z.string().datetime('Formato de fecha de fin inválido'),
  status: z.nativeEnum(SlotStatus).optional().default(SlotStatus.AVAILABLE),
  isRecurring: z.boolean().optional().default(false),
});

export class CreateSlotDto extends createZodDto(CreateSlotSchema) {}
export type CreateSlotInput = z.infer<typeof CreateSlotSchema>;

export const UpdateSlotSchema = CreateSlotSchema.partial();
export class UpdateSlotDto extends createZodDto(UpdateSlotSchema) {}
