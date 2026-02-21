import { z } from 'zod';

export const ServiceSlotSchema = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'BLOCKED']).default('AVAILABLE'),
  isRecurring: z.boolean().default(false),
});

export type ServiceSlotDto = z.infer<typeof ServiceSlotSchema>;
