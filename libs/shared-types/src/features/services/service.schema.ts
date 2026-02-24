import { z } from 'zod';
import { CompanySchema } from '../companies/company.schema';
import { CategorySchema } from '../categories/category.schema';

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
  imageGallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  
  basePrice: z.coerce.number().nullish(), // Prisma Decimal mapped to number for JSON
  showPrice: z.boolean().default(true),
  isActive: z.boolean().default(true),
  
  starsRate: z.coerce.number().default(0),
  reviewsCount: z.coerce.number().default(0),
  
  // Dynamic Attributes
  dynamicAttributes: z.record(z.any()).nullish(),
  workSchedule: z.record(z.any()).nullish(),
  commentsBox: z.record(z.any()).nullish(),
  
  // Geolocation
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  address: z.string().nullish(),
  
  // Joins (Opcionales para DTO de respuesta)
  company: CompanySchema.optional(),
  category: CategorySchema.optional(),
  vendor: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    profile: z.object({
      displayName: z.string(),
      avatarUrl: z.string().nullish(),
      bio: z.string().nullish(),
      isVerified: z.boolean().default(false),
      ratingAvg: z.coerce.number().optional(),
    }).nullish(),
  }).optional(),
  
  branches: z.array(z.any()).optional(), 
  
  metadata: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type ServiceDto = z.infer<typeof ServiceSchema>;
