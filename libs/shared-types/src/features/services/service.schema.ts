import { z } from 'zod';

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  vendorId: z.string().uuid(),
  companyId: z.string().uuid().nullish(),
  categoryId: z.string().uuid(),
  unitId: z.string().uuid().nullish(),
  
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().nullish(),
  imageUrl: z.string().url().nullish(),
  tags: z.array(z.string()).default([]),
  
  basePrice: z.number().nullish(), // Prisma Decimal mapped to number for JSON
  showPrice: z.boolean().default(true),
  isActive: z.boolean().default(true),
  
  starsRate: z.number().default(0),
  reviewsCount: z.number().default(0),
  
  // Dynamic Attributes
  dynamicAttributes: z.record(z.any()).nullish(),
  workSchedule: z.record(z.any()).nullish(),
  commentsBox: z.record(z.any()).nullish(),
  
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type ServiceDto = z.infer<typeof ServiceSchema>;
