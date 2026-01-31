import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const CreateBookingSchema = z.object({
  customerId: z.string().uuid('ID de cliente inválido'),
  serviceId: z.string().uuid('ID de servicio inválido'),
  scheduledDate: z.string().datetime('Fecha programada inválida'),
  slotIds: z.array(z.string().uuid()).optional(), // Opcional si el servicio usa slots
  quantity: z.number().int().min(1).optional().default(1),
});

export class CreateBookingDto extends createZodDto(CreateBookingSchema) {}
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const UpdateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export class UpdateBookingDto extends createZodDto(UpdateBookingSchema) {}
