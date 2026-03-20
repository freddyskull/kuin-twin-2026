import { z } from 'zod';
import { CompanySchema } from '../companies/company.schema';
import { CategorySchema } from '../categories/category.schema';
import { ServiceUnitSchema } from './service-unit.schema';
import { DecimalSchema } from '../../common/decimal';

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  vendorId: z.string().uuid(),
  companyId: z.string().uuid().nullable(),
  categoryId: z.string().uuid(),
  unitId: z.string().uuid().nullable(),
  
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  imageGallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  
  basePrice: DecimalSchema.nullable(), 
  showPrice: z.boolean().default(true),
  isActive: z.boolean().default(true),
  
  starsRate: DecimalSchema.default(0),
  reviewsCount: z.number().int().default(0),
  
  // Dynamic Attributes (Typed as any for now but wrapped in nullable)
  dynamicAttributes: z.any().nullable(),
  workSchedule: z.any().nullable(),
  commentsBox: z.any().nullable(),
  
  // Geolocation
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
  
  // Joins (Opcionales para DTO de respuesta)
  company: CompanySchema.optional(),
  category: CategorySchema.optional(),
  unit: ServiceUnitSchema.optional(),
  vendor: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    profile: z.object({
      displayName: z.string(),
      avatarUrl: z.string().nullish(),
      bio: z.string().nullish(),
      isVerified: z.boolean().default(false),
      ratingAvg: DecimalSchema.optional(),
    }).nullish(),
  }).optional(),
  
  branches: z.array(z.any()).optional(), 
  
  metadata: z.array(z.object({
    id: z.string().uuid().optional(),
    key: z.string(),
    value: z.string(),
  })).optional(),

  faqs: z.array(z.object({
    id: z.string().uuid().optional(),
    question: z.string(),
    answer: z.string(),
    order: z.number().int().optional(),
  })).optional(),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type ServiceDto = z.infer<typeof ServiceSchema>;
