import { z } from 'zod';

export const BranchSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  
  name: z.string().min(3),
  isMain: z.boolean().default(false),
  description: z.string().nullish(),
  
  phone: z.string().nullish(),
  whatsapp: z.string().nullish(),
  email: z.string().email().nullish(),
  
  address: z.string(),
  addressLine2: z.string().nullish(),
  city: z.string(),
  state: z.string(),
  county: z.string().nullish(),
  zipCode: z.string(),
  country: z.string().default('México'),
  
  // En el DTO manejamos lat/lng planos por simplicidad del frontend
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  
  addressNotes: z.string().nullish(),
  businessHours: z.any().nullish(),
  
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

export type BranchDto = z.infer<typeof BranchSchema>;
