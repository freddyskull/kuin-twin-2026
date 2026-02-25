import { z } from 'zod';
import { BookingStatusSchema } from '../../common/enums';

export const CreateBookingSchema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledDate: z.string().or(z.date()),
  slotIds: z.array(z.string().uuid()).optional(),
  quantity: z.number().int().positive().default(1),
  notes: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const UpdateBookingSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
});

export type UpdateBookingInput = z.infer<typeof UpdateBookingSchema>;
