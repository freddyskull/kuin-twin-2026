import { z } from 'zod';
import { DecimalSchema } from '../../common/decimal';

// Esquema base de perfil (Salida)
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().min(1),
  bio: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  
  // Localización (Geometría PostGIS serializada)
  location: z.any().nullable(),
  
  serviceRadiusKm: z.number().int().default(10),
  starsRatio: z.number().int().default(0),
  
  // Redes y contacto
  phone: z.string().nullable(),
  whatsapp: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  tiktok: z.string().nullable(),
  twitter: z.string().nullable(),
  linkedin: z.string().nullable(),
  youtube: z.string().nullable(),
  website: z.string().nullable(),
  
  ratingAvg: DecimalSchema,
  reviewsCount: z.number().int().default(0),
  businessHours: z.any().nullable(),
  isVerified: z.boolean().default(false),
  
  companyId: z.string().uuid().nullable(),
});

// Esquema de entrada (para crear/actualizar)
export const CreateProfileSchema = ProfileSchema.pick({
  displayName: true,
  bio: true,
  avatarUrl: true,
  serviceRadiusKm: true,
  phone: true,
  whatsapp: true,
  facebook: true,
  instagram: true,
  tiktok: true,
  twitter: true,
  linkedin: true,
  youtube: true,
  website: true,
  businessHours: true,
  companyId: true,
}).extend({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

export type ProfileDto = z.infer<typeof ProfileSchema>;
export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// Alias de compatibilidad
export type Profile = ProfileDto;
